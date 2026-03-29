import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

function validateId(id: string | string[] | undefined): string {
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid ID format");
  }
  return id;
}

// Record a payment (tenant action)
export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      agreementId,
      amount,
      paymentDate,
      type,
      description,
      transactionId,
      paymentMethod,
    } = req.body;

    // Verify agreement belongs to tenant
    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: agreementId },
    });

    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    if (agreement.tenantId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const payment = await prisma.payment.create({
      data: {
        agreementId,
        amount,
        paymentDate: new Date(paymentDate),
        dueDate: new Date(paymentDate),
        type,
        description,
        transactionId,
        paymentMethod,
        status: "PAID",
        recordedBy: userId,
      },
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get payments for agreement
export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let agreementId: string;
    try {
      agreementId = validateId(req.params.agreementId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid agreement ID" });
    }

    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: agreementId },
    });

    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    if (agreement.landlordId !== userId && agreement.tenantId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const payments = await prisma.payment.findMany({
      where: { agreementId },
      orderBy: { dueDate: "asc" },
    });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update payment status (landlord action)
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let paymentId: string;
    try {
      paymentId = validateId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid payment ID" });
    }

    const { status } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { agreement: true },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (payment.agreement.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });

    res.json({
      success: true,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get payment summary for landlord
export const getPaymentSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const agreements = await prisma.rentalAgreement.findMany({
      where: {
        landlordId: userId,
        status: "ACTIVE",
      },
      include: {
        payments: true,
        tenant: true,
        property: true,
      },
    });

    const summary = {
      totalMonthlyCollection: 0,
      totalPending: 0,
      totalPaid: 0,
      agreements: agreements.map((agreement) => ({
        propertyTitle: agreement.property.title,
        tenantName: agreement.tenant.fullName,
        monthlyRent: agreement.monthlyRent,
        payments: agreement.payments,
        pendingAmount: agreement.payments
          .filter((p) => p.status === "PENDING")
          .reduce((sum, p) => sum + p.amount, 0),
        paidAmount: agreement.payments
          .filter((p) => p.status === "PAID")
          .reduce((sum, p) => sum + p.amount, 0),
      })),
    };

    summary.totalMonthlyCollection = agreements.reduce(
      (sum, a) => sum + a.monthlyRent,
      0
    );
    summary.totalPending = agreements.reduce(
      (sum, a) =>
        sum +
        a.payments
          .filter((p) => p.status === "PENDING")
          .reduce((s, p) => s + p.amount, 0),
      0
    );
    summary.totalPaid = agreements.reduce(
      (sum, a) =>
        sum +
        a.payments
          .filter((p) => p.status === "PAID")
          .reduce((s, p) => s + p.amount, 0),
      0
    );

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
