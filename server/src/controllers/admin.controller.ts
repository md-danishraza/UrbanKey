import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import { validatePropertyId } from "./property.controller.js";
import { deletePropertyImages } from "../services/storage.service.js";

// Helper function to validate ID
const validateId = (id: string | string[] | undefined): string => {
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid ID format");
  }
  return id;
};

// Get all pending verifications
export const getPendingVerifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await prisma.userDocument.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all verifications (with filters)
export const getAllVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const [documents, total] = await Promise.all([
      prisma.userDocument.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          uploadedAt: "desc",
        },
        skip,
        take: Number(limit),
      }),
      prisma.userDocument.count({ where }),
    ]);

    res.json({
      success: true,
      documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get verification stats
export const getVerificationStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [pending, approved, rejected, total] = await Promise.all([
      prisma.userDocument.count({ where: { status: "PENDING" } }),
      prisma.userDocument.count({ where: { status: "APPROVED" } }),
      prisma.userDocument.count({ where: { status: "REJECTED" } }),
      prisma.userDocument.count(),
    ]);

    // Get daily stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await prisma.userDocument.groupBy({
      by: ["status"],
      where: {
        uploadedAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        status: true,
      },
    });

    res.json({
      success: true,
      stats: {
        pending,
        approved,
        rejected,
        total,
        daily: dailyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Approve document
export const approveDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let documentId: string;
    try {
      documentId = validateId(req.params.documentId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await prisma.userDocument.update({
      where: { id: documentId },
      data: {
        status: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: userId,
      },
      include: {
        user: true,
      },
    });

    // If user has all required documents approved, update user's verification status
    const allDocs = await prisma.userDocument.findMany({
      where: {
        userId: document.userId,
        status: "APPROVED",
      },
    });

    // Check if user has all required documents (Aadhar is mandatory)
    const hasAadhar = allDocs.some((doc) => doc.documentType === "aadhar");

    if (hasAadhar) {
      await prisma.user.update({
        where: { id: document.userId },
        data: {
          isVerified: true,
        },
      });
    }

    // send mail to user (user)
    // your document is verified

    res.json({
      success: true,
      document,
      message: "Document approved successfully",
    });
  } catch (error) {
    console.error("Error approving document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject document
export const rejectDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let documentId: string;
    try {
      documentId = validateId(req.params.documentId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const { reason } = req.body;

    const document = await prisma.userDocument.update({
      where: { id: documentId },
      data: {
        status: "REJECTED",
        rejectionReason: reason || "No reason provided",
        verifiedAt: new Date(),
        verifiedBy: userId,
      },
    });

    res.json({
      success: true,
      document,
      message: "Document rejected",
    });
  } catch (error) {
    console.error("Error rejecting document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get document by ID
export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let documentId: string;
    try {
      documentId = validateId(req.params.documentId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await prisma.userDocument.findUnique({
      where: { id: documentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// dashboard page
// Get platform user stats
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalLandlords, totalTenants] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "LANDLORD" } }),
      prisma.user.count({ where: { role: "TENANT" } }),
    ]);

    res.json({
      success: true,
      totalUsers,
      totalLandlords,
      totalTenants,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get property stats
export const getPropertyStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalProperties, activeProperties] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { isActive: true } }),
    ]);

    res.json({
      success: true,
      totalProperties,
      activeProperties,
    });
  } catch (error) {
    console.error("Error fetching property stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get monthly active users
export const getMonthlyActiveUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const count = await prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    res.json({
      success: true,
      count: count.length,
    });
  } catch (error) {
    console.error("Error fetching monthly active users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// properties mgt
// Get all properties for admin (with filters)
export const getAdminProperties = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (status === "ACTIVE") where.isActive = true;
    else if (status === "INACTIVE") where.isActive = false;
    else if (status === "PENDING") where.isActive = false; // Add logic for pending if needed

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { city: { contains: search as string, mode: "insensitive" } },
        {
          landlord: {
            fullName: { contains: search as string, mode: "insensitive" },
          },
        },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          landlord: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.property.count({ where }),
    ]);

    // Get view counts for each property
    const propertiesWithStats = await Promise.all(
      properties.map(async (property) => {
        const views = await prisma.analyticsEvent.count({
          where: { propertyId: property.id, eventType: "property_view" },
        });
        const leads = await prisma.lead.count({
          where: { propertyId: property.id },
        });

        return {
          ...property,
          views,
          leads,
          status: property.isActive ? "ACTIVE" : "INACTIVE",
        };
      })
    );

    res.json({
      success: true,
      data: propertiesWithStats,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching admin properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get property statistics for admin dashboard
export const getAdminPropertyStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const [totalProperties, activeProperties] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { isActive: true } }),
    ]);

    const [totalViews, totalLeads] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: "property_view" } }),
      prisma.lead.count(),
    ]);

    res.json({
      success: true,
      totalProperties,
      activeProperties,
      inactiveProperties: totalProperties - activeProperties,
      totalViews,
      totalLeads,
    });
  } catch (error) {
    console.error("Error fetching property stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update property status (activate/deactivate)
export const updatePropertyStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    let { propertyId } = req.params;
    const { isActive } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    propertyId = validatePropertyId(propertyId);

    // Verify admin
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { isActive },
    });

    res.json({
      success: true,
      message: `Property ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete property (admin only)
export const deletePropertyAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    let { propertyId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Verify admin
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    propertyId = validatePropertyId(propertyId);
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Delete all images from Supabase storage rquired landlord id for path
    await deletePropertyImages(propertyId, property.landlordId);

    // Delete property (cascade will handle images, leads, visits, etc.)
    await prisma.property.delete({
      where: { id: propertyId },
    });

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// user mgt
// Get all users for admin (with filters)
export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (role && role !== "ALL") {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { phone: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          isVerified: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user statistics for admin dashboard
export const getAdminUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, verified, unverified, tenants, landlords, admins] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isVerified: true } }),
        prisma.user.count({ where: { isVerified: false } }),
        prisma.user.count({ where: { role: "TENANT" } }),
        prisma.user.count({ where: { role: "LANDLORD" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
      ]);

    res.json({
      success: true,
      totalUsers,
      verified,
      unverified,
      tenants,
      landlords,
      admins,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    let { userId } = req.params;
    const { role } = req.body;

    userId = validateId(userId);

    if (!role || !["TENANT", "LANDLORD", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify user (admin only)
export const verifyUser = async (req: AuthRequest, res: Response) => {
  try {
    let { userId } = req.params;
    userId = validateId(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    res.json({
      success: true,
      message: "User verified successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    let { userId } = req.params;

    userId = validateId(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow deleting self
    if (user.id === req.auth?.userId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
