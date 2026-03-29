import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Helper function to validate and extract userId from params
const validateUserId = (userId: string | string[] | undefined): string => {
  if (!userId || Array.isArray(userId)) {
    throw new Error("Invalid user ID");
  }
  return userId;
};

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
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const requestingUserId = req.auth?.userId;
    if (!requestingUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate and extract userId from params
    let targetUserId: string;
    try {
      targetUserId = validateUserId(req.params.userId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Only allow users to view their own profile unless admin
    if (targetUserId !== requestingUserId) {
      // Check if user is admin
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
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { fullName, phone, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        avatarUrl,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Optional: Check if user has active properties/leases before deleting
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// sync users
export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Notice we use fullName instead of firstName/lastName based on your schema
    const { email, fullName, avatarUrl, role } = req.body;

    // UPSERT: Updates the user if they exist, Creates them if they don't
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        fullName,
        avatarUrl,
        // We don't update email or role here to prevent overwriting
      },
      create: {
        id: userId,
        email,
        fullName,
        avatarUrl,
        role: role || "TENANT",
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProperties = async (req: AuthRequest, res: Response) => {
  try {
    const requestingUserId = req.auth?.userId;
    if (!requestingUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate and extract userId from params
    let targetUserId: string;
    try {
      targetUserId = validateUserId(req.params.userId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Only allow users to view their own properties unless admin
    if (targetUserId !== requestingUserId) {
      const requestingUser = await prisma.user.findUnique({
        where: { id: requestingUserId },
      });

      if (requestingUser?.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const properties = await prisma.property.findMany({
      where: { landlordId: targetUserId },
      include: {
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching user properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

    // Get view counts for each property
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
