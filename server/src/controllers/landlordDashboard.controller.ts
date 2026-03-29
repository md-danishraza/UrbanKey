import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Get landlord dashboard stats
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user to verify landlord role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "LANDLORD") {
      return res.status(403).json({ error: "Not a landlord account" });
    }

    // Get all properties for this landlord
    const properties = await prisma.property.findMany({
      where: { landlordId: userId },
      select: {
        id: true,
        isActive: true,
      },
    });

    const propertyIds = properties.map((p) => p.id);

    // Get total views from analytics
    const totalViews = await prisma.analyticsEvent.count({
      where: {
        propertyId: { in: propertyIds },
        eventType: "property_view",
      },
    });

    // Get total leads
    const totalLeads = await prisma.lead.count({
      where: {
        propertyId: { in: propertyIds },
      },
    });

    // Get total visits
    const totalVisits = await prisma.visitSchedule.count({
      where: {
        propertyId: { in: propertyIds },
      },
    });

    // Get total agreements
    const totalAgreements = await prisma.rentalAgreement.count({
      where: {
        landlordId: userId,
      },
    });

    // Get total properties and active count
    const totalProperties = properties.length;
    const activeProperties = properties.filter((p) => p.isActive).length;

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeProperties,
        totalViews,
        totalLeads,
        totalVisits,
        totalAgreements,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get recent leads for dashboard
export const getRecentLeads = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const limit = parseInt(req.query.limit as string) || 5;

    // Get property IDs for this landlord
    const properties = await prisma.property.findMany({
      where: { landlordId: userId },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    const leads = await prisma.lead.findMany({
      where: {
        propertyId: { in: propertyIds },
      },
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
      take: limit,
    });

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Error fetching recent leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
