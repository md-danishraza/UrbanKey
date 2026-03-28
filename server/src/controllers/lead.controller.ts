import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Create a lead (enquiry) - Tenant action
export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { propertyId, message, contactMethod } = req.body;

    const lead = await prisma.lead.create({
      data: {
        propertyId,
        tenantId: userId,
        message,
        contactMethod,
        status: "NEW",
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
        eventType: "lead_created",
        userId,
        propertyId,
      },
    });

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get leads for landlord (all leads for their properties)
export const getLandlordLeads = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { status, propertyId, page = 1, limit = 10 } = req.query;

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

    const leads = await prisma.lead.findMany({
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

    const total = await prisma.lead.count({ where });

    res.json({
      success: true,
      leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching landlord leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get leads for tenant (all enquiries made by tenant)
export const getTenantLeads = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const leads = await prisma.lead.findMany({
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
            landlord: {
              select: {
                id: true,
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Error fetching tenant leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update lead status (landlord action)
export const updateLeadStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { leadId } = req.params;
    const { status } = req.body;

    // Validate leadId is a string, not array
    if (!leadId || Array.isArray(leadId)) {
      return res.status(400).json({ error: "Invalid lead ID" });
    }

    if (
      !status ||
      !["NEW", "CONTACTED", "CONVERTED", "CLOSED"].includes(status)
    ) {
      return res.status(400).json({ error: "Valid status is required" });
    }

    // Get lead with property - include the property relation
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        property: {
          select: { landlordId: true, title: true },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Verify landlord owns the property - using optional chaining
    if (lead.property?.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });

    res.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
