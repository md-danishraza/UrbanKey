import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import { BHKType, FurnishingType, TenantType } from "@prisma/client";

// Helper function to validate and extract property ID from params
const validatePropertyId = (
  propertyId: string | string[] | undefined
): string => {
  if (!propertyId || Array.isArray(propertyId)) {
    throw new Error("Invalid property ID");
  }
  return propertyId;
};

// Get all properties with optional filtering
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const {
      city,
      minRent,
      maxRent,
      bhk,
      furnishing,
      tenantType,
      hasWater247,
      hasPowerBackup,
      hasIglPipeline,
      isDirectOwner,
      nearbyMetro,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (city) {
      where.city = { contains: city as string, mode: "insensitive" };
    }

    if (minRent || maxRent) {
      where.rent = {};
      if (minRent) where.rent.gte = Number(minRent);
      if (maxRent) where.rent.lte = Number(maxRent);
    }

    if (bhk) {
      const bhkArray = (bhk as string).split(",");
      where.bhk = { in: bhkArray as BHKType[] };
    }

    if (furnishing) {
      const furnishingArray = (furnishing as string).split(",");
      where.furnishing = { in: furnishingArray as FurnishingType[] };
    }

    if (tenantType) {
      where.tenantType = tenantType as TenantType;
    }

    if (hasWater247 === "true") where.hasWater247 = true;
    if (hasPowerBackup === "true") where.hasPowerBackup = true;
    if (hasIglPipeline === "true") where.hasIglPipeline = true;
    if (isDirectOwner === "true") where.isBroker = false;
    if (nearbyMetro === "true") where.distanceToMetroKm = { not: null };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          landlord: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              isVerified: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      data: properties,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search properties (more advanced search)
export const searchProperties = async (req: Request, res: Response) => {
  try {
    const { q, city } = req.query;

    if (!q) {
      return getAllProperties(req, res);
    }

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: "insensitive" } },
          { description: { contains: q as string, mode: "insensitive" } },
          { addressLine1: { contains: q as string, mode: "insensitive" } },
          { city: { contains: q as string, mode: "insensitive" } },
        ],
        ...(city && {
          city: { contains: city as string, mode: "insensitive" },
        }),
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        landlord: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(properties);
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single property by ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        landlord: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
            phone: true,
            email: true,
          },
        },
        wishlists: true,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Track view for analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: "property_view",
        propertyId: property.id,
      },
    });

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new property (landlord only)
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user exists and has landlord role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is tenant, we might want to upgrade them to landlord
    if (user.role === "TENANT") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "LANDLORD" },
      });
    }

    const propertyData = req.body;

    // Create property with images
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        landlordId: userId,
        images: {
          create:
            propertyData.images?.map((url: string, index: number) => ({
              imageUrl: url,
              isPrimary: index === 0,
              sortOrder: index,
            })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    // Track creation for analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: "property_created",
        userId,
        propertyId: property.id,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update property
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (existingProperty.landlordId !== userId) {
      // Check if admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const propertyData = req.body;

    // Update property
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: propertyData,
      include: {
        images: true,
      },
    });

    res.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (existingProperty.landlordId !== userId) {
      // Check if admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    // Delete property (cascade will handle related records)
    await prisma.property.delete({
      where: { id: propertyId },
    });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle property availability (active/inactive)
export const togglePropertyAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (existingProperty.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Toggle isActive
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        isActive: !existingProperty.isActive,
      },
    });

    res.json({
      message: `Property ${
        property.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: property.isActive,
    });
  } catch (error) {
    console.error("Error toggling property availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
