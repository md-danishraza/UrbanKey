import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Create a visit request - Tenant action
export const createVisit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { propertyId, scheduledDate, scheduledTime, notes } = req.body;

    const visit = await prisma.visitSchedule.create({
      data: {
        propertyId,
        tenantId: userId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        notes,
        status: "PENDING",
      },
      include: {
        property: {
          select: {
            title: true,
            landlordId: true,
          },
        },
      },
    });

    // Track analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: "visit_scheduled",
        userId,
        propertyId,
      },
    });

    res.status(201).json({
      success: true,
      visit,
    });
  } catch (error) {
    console.error("Error creating visit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get visits for landlord (all visits for their properties)
export const getLandlordVisits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { status, propertyId } = req.query;

    // Get all properties owned by this landlord
    const properties = await prisma.property.findMany({
      where: { landlordId: userId },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    const where: any = {
      propertyId: { in: propertyIds },
    };

    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;

    const visits = await prisma.visitSchedule.findMany({
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
      orderBy: { scheduledDate: "asc" },
    });

    res.json({
      success: true,
      visits,
    });
  } catch (error) {
    console.error("Error fetching landlord visits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get visits for tenant
export const getTenantVisits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const visits = await prisma.visitSchedule.findMany({
      where: { tenantId: userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            addressLine1: true,
            city: true,
            landlord: {
              select: {
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledDate: "asc" },
    });

    res.json({
      success: true,
      visits,
    });
  } catch (error) {
    console.error("Error fetching tenant visits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update visit status (landlord action)
// Update visit status (landlord action)
export const updateVisitStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { visitId } = req.params;
    const { status } = req.body;

    // Validate visitId is a string, not array
    if (!visitId || Array.isArray(visitId)) {
      return res.status(400).json({ error: "Invalid visit ID" });
    }

    if (
      !status ||
      !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
    ) {
      return res.status(400).json({ error: "Valid status is required" });
    }

    // Get visit with property - include the property relation
    const visit = await prisma.visitSchedule.findUnique({
      where: { id: visitId },
      include: {
        property: {
          select: { landlordId: true, title: true },
        },
      },
    });

    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }

    // Verify landlord owns the property
    if (visit.property?.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedVisit = await prisma.visitSchedule.update({
      where: { id: visitId },
      data: { status },
    });

    res.json({
      success: true,
      visit: updatedVisit,
    });
  } catch (error) {
    console.error("Error updating visit status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
