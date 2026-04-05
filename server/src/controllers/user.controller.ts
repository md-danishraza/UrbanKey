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

// sync users with Clerk metadata update
export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Notice we use fullName instead of firstName/lastName based on your schema
    const { email, fullName, avatarUrl, role, phone } = req.body;

    // console.log(phone);

    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // UPSERT: Updates the user if they exist, Creates them if they don't
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        fullName,
        avatarUrl,
        // Don't override role if user already exists
        role: existingUser?.role || role?.toUpperCase() || "TENANT",
        // We don't update email here to prevent overwriting
        phone: phone,
      },
      create: {
        id: userId,
        email,
        fullName,
        avatarUrl,
        role: role?.toUpperCase() || "TENANT",
      },
    });

    //  // Parse name for Clerk (firstName and lastName)
    //  const firstName = fullName?.split(" ")[0] || "";
    //  const lastName = fullName?.split(" ").slice(1).join(" ") || "";

    // already implemented via nextjs api routes
    // // Update Clerk metadata with role
    // try {
    //   await clerkClient.users.updateUser(userId, {
    //     firstName,
    //     lastName,
    //     // Note: Newer Clerk SDKs may ignore external profileImageUrl updates.
    //     // If this throws, you may need to remove it.
    //     ...(email && { emailAddress: [email] }),
    //     ...(avatarUrl && { profileImageUrl: avatarUrl }),
    //     publicMetadata: {
    //       role: role?.toLowerCase() || "tenant",
    //       syncedAt: new Date().toISOString(),
    //     },
    //   });
    //   console.log(
    //     `✅ Updated Clerk metadata for user ${userId} with role: ${
    //       role?.toLowerCase() || "tenant"
    //     }`
    //   );
    // } catch (clerkError) {
    //   console.error("Error updating Clerk metadata:", clerkError);
    //   // Don't fail the request if Clerk update fails, just log it
    // }

    res.json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Rest of your existing controller functions...
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

    // Update Clerk metadata as well
    try {
      const firstName = fullName?.split(" ")[0] || "";
      const lastName = fullName?.split(" ").slice(1).join(" ") || "";

      await clerkClient.users.updateUser(userId, {
        firstName,
        lastName,
        // Same note as above regarding profileImageUrl
        ...(avatarUrl && { profileImageUrl: avatarUrl }),
      });
    } catch (clerkError) {
      console.error("Error updating Clerk user:", clerkError);
    }

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

// Check if landlord is verified
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
