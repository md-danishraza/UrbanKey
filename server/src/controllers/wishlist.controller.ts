import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Helper function to validate ID
function validateId(id: string | string[] | undefined): string {
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid ID format");
  }
  return id;
}

// Add property to wishlist
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let propertyId: string;
    try {
      propertyId = validateId(req.params.propertyId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        tenantId: userId,
        propertyId: propertyId,
      },
    });

    if (existing) {
      return res.json({
        success: true,
        wishlist: existing,
        message: "Already in wishlist",
      });
    }

    // Create new wishlist item
    const wishlist = await prisma.wishlist.create({
      data: {
        tenantId: userId,
        propertyId: propertyId,
      },
    });

    res.json({
      success: true,
      wishlist,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let propertyId: string;
    try {
      propertyId = validateId(req.params.propertyId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    // Delete using deleteMany to avoid composite key issues
    const result = await prisma.wishlist.deleteMany({
      where: {
        tenantId: userId,
        propertyId: propertyId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }

    res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's wishlist
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { tenantId: userId },
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            landlord: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      wishlist: wishlist.map((item) => ({
        id: item.id,
        propertyId: item.propertyId,
        property: item.property,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if property is in wishlist
export const checkWishlistStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let propertyId: string;
    try {
      propertyId = validateId(req.params.propertyId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        tenantId: userId,
        propertyId: propertyId,
      },
    });

    res.json({
      success: true,
      isInWishlist: !!wishlistItem,
      wishlistId: wishlistItem?.id,
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get wishlist count for user
export const getWishlistCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const count = await prisma.wishlist.count({
      where: { tenantId: userId },
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
