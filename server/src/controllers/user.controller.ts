import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { createClerkClient } from "@clerk/backend";
import prisma from "../config/database.js";

// Initialize the Clerk client using your environment variable
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Helper function to validate and extract userId from params
const validateUserId = (userId: string | string[] | undefined): string => {
  if (!userId || Array.isArray(userId)) {
    throw new Error("Invalid user ID");
  }
  return userId;
};

// ==================== USER MANAGEMENT ====================

/**
 * GET /api/users/me
 * Get current authenticated user's profile
 */
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: true,
        wishlist: {
          include: {
            property: true,
          },
        },
        visits: true,
        leads: true,
        documents: true,
        landlordAgreement: true,
        tenantAgreement: true,
        onboardingProgress: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/users/:userId
 * Get user by ID (requires admin or self)
 */
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const requestingUserId = req.auth?.userId;
    if (!requestingUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let targetUserId: string;
    try {
      targetUserId = validateUserId(req.params.userId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Only allow users to view their own profile unless admin
    if (targetUserId !== requestingUserId) {
      const requestingUser = await prisma.user.findUnique({
        where: { id: requestingUserId },
      });

      if (requestingUser?.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        properties: true,
        wishlist: {
          include: {
            property: true,
          },
        },
        visits: true,
        leads: true,
        documents: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/users/me
 * Update current user's profile (for profile management page)
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { fullName, phone, avatarUrl, email } = req.body;

    // Update Clerk metadata as well
    try {
      const firstName = fullName?.split(" ")[0] || "";
      const lastName = fullName?.split(" ").slice(1).join(" ") || "";

      const updateData: any = {
        firstName,
        lastName,
      };

      if (avatarUrl) {
        updateData.profileImageUrl = avatarUrl;
      }

      await clerkClient.users.updateUser(userId, updateData);
    } catch (clerkError) {
      console.error("Error updating Clerk user:", clerkError);
    }

    // Update database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        avatarUrl,
        ...(email && { email }),
      },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/users/me
 * Delete current user's account
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check for active agreements before deletion
    const activeAgreements = await prisma.rentalAgreement.findFirst({
      where: {
        OR: [
          { tenantId: userId, status: "ACTIVE" },
          { landlordId: userId, status: "ACTIVE" },
        ],
      },
    });

    if (activeAgreements) {
      return res.status(400).json({
        error: "Cannot delete account",
        message:
          "You have active rental agreements. Please resolve them before deleting your account.",
      });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== USER SYNC ====================

/**
 * POST /api/users/sync
 * Sync user with Clerk metadata
 */
export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email, fullName, avatarUrl, role, phone } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        fullName,
        avatarUrl,
        role: existingUser?.role || role?.toUpperCase() || "TENANT",
        phone: phone,
      },
      create: {
        id: userId,
        email,
        fullName,
        avatarUrl,
        role: role?.toUpperCase() || "TENANT",
        phone,
      },
    });

    res.json({
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== LANDLORD SPECIFIC ====================

/**
 * GET /api/users/landlord/me
 * Get landlord's properties with analytics
 */
export const getLandlordProperties = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const properties = await prisma.property.findMany({
      where: { landlordId: userId },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const propertiesWithViews = await Promise.all(
      properties.map(async (property) => {
        const views = await prisma.analyticsEvent.count({
          where: {
            propertyId: property.id,
            eventType: "property_view",
          },
        });

        const leads = await prisma.lead.count({
          where: { propertyId: property.id },
        });

        return {
          ...property,
          views,
          leads,
        };
      })
    );

    res.json({
      success: true,
      data: propertiesWithViews,
    });
  } catch (error) {
    console.error("Error fetching landlord properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/users/landlord/isVerified
 * Check if landlord is verified
 */
export const isLandlordVerified = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "LANDLORD") {
      return res.status(403).json({ error: "User is not a landlord" });
    }

    res.json({
      success: true,
      isVerified: user.isVerified,
      message: user.isVerified
        ? "Landlord is verified"
        : "Landlord is not verified. Please complete verification to create properties.",
    });
  } catch (error) {
    console.error("Error checking landlord verification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== PROFILE MANAGEMENT (For Future Implementation) ====================

/**
 * GET /api/users/me/documents
 * Get user's uploaded documents (for profile page)
 */
export const getUserDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await prisma.userDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/users/me/agreements
 * Get user's rental agreements (for profile page)
 */
export const getUserAgreements = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        agreementsAsTenant: {
          include: {
            property: true,
          },
          orderBy: { createdAt: "desc" },
        },
        agreementsAsLandlord: {
          include: {
            property: true,
            tenant: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.json({
      success: true,
      data: {
        asTenant: user?.agreementsAsTenant || [],
        asLandlord: user?.agreementsAsLandlord || [],
      },
    });
  } catch (error) {
    console.error("Error fetching user agreements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
