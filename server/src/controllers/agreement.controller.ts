import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import { generateAgreementNumber } from "../utils/helpers.js";
import { PaymentStatus, PaymentType } from "@prisma/client";

// Helper to validate ID
function validateId(id: string | string[] | undefined): string {
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid ID format");
  }
  return id;
}

// Create a new rental agreement (landlord action)
export const createAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      propertyId,
      tenantId,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      maintenanceFee,
      terms,
      specialConditions,
    } = req.body;

    // Verify property belongs to landlord
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if property is already occupied
    if (property.isOccupied) {
      return res.status(400).json({ error: "Property is already occupied" });
    }

    // Verify tenant exists
    const tenant = await prisma.user.findUnique({
      where: { id: tenantId },
    });

    if (!tenant || tenant.role !== "TENANT") {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Generate unique agreement number
    const agreementNumber = await generateAgreementNumber();

    // Create agreement with PENDING_SIGNATURE status (since landlord is sending it)
    const agreement = await prisma.rentalAgreement.create({
      data: {
        agreementNumber,
        propertyId,
        tenantId,
        landlordId: userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent,
        securityDeposit,
        maintenanceFee,
        terms,
        specialConditions,
        status: "PENDING_SIGNATURE", // Changed from DRAFT to PENDING_SIGNATURE
        signedByLandlord: true, // Landlord implicitly signs by creating the agreement
      },
      include: {
        property: true,
        tenant: true,
      },
    });

    res.status(201).json({
      success: true,
      agreement,
    });
  } catch (error) {
    console.error("Error creating agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get agreements for landlord
export const getLandlordAgreements = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const where: any = {
      landlordId: userId,
    };

    if (status) where.status = status;

    const agreements = await prisma.rentalAgreement.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.rentalAgreement.count({ where });

    res.json({
      success: true,
      agreements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching landlord agreements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get agreements for tenant
export const getTenantAgreements = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get all agreements (both pending and active)
    const agreements = await prisma.rentalAgreement.findMany({
      where: {
        tenantId: userId,
        status: {
          in: ["PENDING_SIGNATURE", "ACTIVE"], // Include both
        },
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            addressLine1: true,
            city: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      agreements,
    });
  } catch (error) {
    console.error("Error fetching tenant agreements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get tenant's current rental (active or pending)
export const getTenantCurrentRental = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // First try to get active agreement
    let agreement = await prisma.rentalAgreement.findFirst({
      where: {
        tenantId: userId,
        status: "ACTIVE",
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            addressLine1: true,
            city: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    // If no active agreement, check for pending signature
    if (!agreement) {
      agreement = await prisma.rentalAgreement.findFirst({
        where: {
          tenantId: userId,
          status: "PENDING_SIGNATURE",
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              addressLine1: true,
              city: true,
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
          landlord: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json({
      success: true,
      agreement,
    });
  } catch (error) {
    console.error("Error fetching tenant current rental:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single agreement by ID
export const getAgreementById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let agreementId: string;
    try {
      agreementId = validateId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid agreement ID" });
    }

    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: agreementId },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        payments: {
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    // Check authorization
    if (agreement.landlordId !== userId && agreement.tenantId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({
      success: true,
      agreement,
    });
  } catch (error) {
    console.error("Error fetching agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Sign agreement (tenant action)
export const signAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let agreementId: string;
    try {
      agreementId = validateId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid agreement ID" });
    }

    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: agreementId },
      include: { property: true },
    });

    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    if (agreement.tenantId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (
      agreement.status !== "PENDING_SIGNATURE" &&
      agreement.status !== "DRAFT"
    ) {
      return res.status(400).json({ error: "Agreement cannot be signed" });
    }

    const updatedAgreement = await prisma.rentalAgreement.update({
      where: { id: agreementId },
      data: {
        signedByTenant: true,
        signedAt: new Date(),
        status: agreement.signedByLandlord ? "ACTIVE" : "PENDING_SIGNATURE",
      },
    });

    // If fully signed, activate the agreement and update property
    if (updatedAgreement.status === "ACTIVE") {
      await prisma.$transaction([
        prisma.property.update({
          where: { id: agreement.propertyId },
          data: {
            isOccupied: true,
            currentTenantId: agreement.tenantId,
            occupiedFrom: agreement.startDate,
            occupiedUntil: agreement.endDate,
          },
        }),
        // Create payment schedule
        prisma.payment.createMany({
          data: generatePaymentSchedule(agreement),
        }),
      ]);
    }

    res.json({
      success: true,
      agreement: updatedAgreement,
    });
  } catch (error) {
    console.error("Error signing agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper to generate payment schedule
function generatePaymentSchedule(agreement: any) {
  const payments = [];
  const startDate = new Date(agreement.startDate);
  const endDate = new Date(agreement.endDate);
  let currentDate = new Date(startDate);

  let monthCount = 1;
  while (currentDate <= endDate) {
    const dueDate = new Date(currentDate);
    dueDate.setDate(5); // Rent due on 5th of each month

    payments.push({
      agreementId: agreement.id,
      amount: agreement.monthlyRent,
      month: monthCount,
      year: currentDate.getFullYear(),
      paymentDate: dueDate,
      dueDate: dueDate,
      type: PaymentType.RENT,
      status: PaymentStatus.PENDING,
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    monthCount++;
  }

  // Add security deposit payment
  payments.push({
    agreementId: agreement.id,
    amount: agreement.securityDeposit,
    month: 0,
    year: startDate.getFullYear(),
    paymentDate: startDate,
    dueDate: startDate,
    type: PaymentType.SECURITY_DEPOSIT,
    status: PaymentStatus.PENDING,
    description: "Security Deposit",
  });

  return payments;
}

// Get agreement PDF
export const getAgreementPDF = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let agreementId: string;
    try {
      agreementId = validateId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid agreement ID" });
    }

    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: agreementId },
      include: {
        property: true,
        tenant: true,
        landlord: true,
      },
    });

    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    if (agreement.landlordId !== userId && agreement.tenantId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // TODO: Generate PDF using react-pdf or pdfkit
    // For now, return the agreement data
    res.json({
      success: true,
      agreement,
    });
  } catch (error) {
    console.error("Error fetching agreement PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
