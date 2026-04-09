import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import {
  upsertPropertyEmbedding,
  semanticSearch,
} from "../services/embedding.service.js";

// ==================== HELPER FUNCTIONS ====================

/**
 * Validates and extracts property ID from request params
 * @param propertyId - The property ID from request params
 * @returns Validated property ID string
 * @throws Error if ID is invalid
 */
export const validatePropertyId = (
  propertyId: string | string[] | undefined
): string => {
  if (!propertyId || Array.isArray(propertyId)) {
    throw new Error("Invalid property ID");
  }
  return propertyId;
};

// ==================== PUBLIC ROUTES ====================

/**
 * GET /api/properties
 * Get all properties with optional filtering and pagination
 */
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

    // Apply filters
    if (city) {
      where.city = { contains: city as string, mode: "insensitive" };
    }

    if (minRent || maxRent) {
      where.rent = {};
      if (minRent) where.rent.gte = Number(minRent);
      if (maxRent) where.rent.lte = Number(maxRent);
    }

    // BHK filter mapping
    if (bhk) {
      const bhkArray = (bhk as string).split(",");
      const bhkMapping: Record<string, string> = {
        "1BHK": "ONE_BHK",
        "2BHK": "TWO_BHK",
        "3BHK": "THREE_BHK",
        "4BHK+": "FOUR_BHK_PLUS",
      };
      const mappedBhk = bhkArray.map((b) => bhkMapping[b] || b);
      where.bhk = { in: mappedBhk };
    }

    // Furnishing filter mapping
    if (furnishing) {
      const furnishingArray = (furnishing as string).split(",");
      const furnishingMapping: Record<string, string> = {
        unfurnished: "UNFURNISHED",
        "semi-furnished": "SEMI_FURNISHED",
        "fully-furnished": "FULLY_FURNISHED",
      };
      const mappedFurnishing = furnishingArray.map(
        (f) => furnishingMapping[f] || f
      );
      where.furnishing = { in: mappedFurnishing };
    }

    // Tenant type filter mapping
    if (tenantType) {
      const tenantMapping: Record<string, string> = {
        family: "FAMILY",
        bachelors: "BACHELORS",
        both: "BOTH",
      };
      where.tenantType = tenantMapping[tenantType as string] || tenantType;
    }

    // Boolean filters
    if (hasWater247 === "true") where.hasWater247 = true;
    if (hasPowerBackup === "true") where.hasPowerBackup = true;
    if (hasIglPipeline === "true") where.hasIglPipeline = true;
    if (isDirectOwner === "true") where.isBroker = false;
    if (nearbyMetro === "true") where.distanceToMetroKm = { not: null };

    // Execute queries in parallel
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
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET /api/properties/semantic
 * AI-powered semantic search using vector embeddings
 */
export const semanticSearchProperties = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    // Validate search query
    if (!q || typeof q !== "string") {
      return res.status(400).json({
        error: "Search query required",
        message:
          "Please provide a search query (e.g., 'spacious 2BHK near metro')",
      });
    }

    if (q.length < 3) {
      return res.status(400).json({
        error: "Search query too short",
        message: "Search query must be at least 3 characters",
      });
    }

    const results = await semanticSearch(q, Number(limit));

    res.json({
      success: true,
      query: q,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("Error in semantic search:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to perform semantic search. Please try again.",
    });
  }
};

/**
 * GET /api/properties/:id
 * Get single property by ID with analytics tracking
 */
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid property ID format",
        message: "Property ID must be a valid string",
      });
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
      return res.status(404).json({
        error: "Property not found",
        message: `Property with ID ${propertyId} does not exist`,
      });
    }

    // Track view for analytics (async, don't await)
    prisma.analyticsEvent
      .create({
        data: {
          eventType: "property_view",
          propertyId: property.id,
        },
      })
      .catch((err) => console.error("Failed to track view:", err));

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch property details",
    });
  }
};

/**
 * GET /api/properties/stats
 * Get platform statistics for landing page
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const [totalProperties, totalTenants, totalLandlords, totalAgreements] =
      await Promise.all([
        prisma.property.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: "TENANT" } }),
        prisma.user.count({ where: { role: "LANDLORD" } }),
        prisma.rentalAgreement.count({ where: { status: "ACTIVE" } }),
      ]);

    res.json({
      totalProperties,
      totalTenants,
      totalLandlords,
      totalAgreements,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch platform statistics",
    });
  }
};

// ==================== PROTECTED ROUTES (Require Authentication) ====================

/**
 * POST /api/properties
 * Create a new property listing (Landlord or Admin only)
 */
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required to create property",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account does not exist",
      });
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "bhk",
      "rent",
      "furnishing",
      "tenantType",
      "addressLine1",
      "city",
      "state",
      "pincode",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        message: `The following fields are required: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Upgrade tenant to landlord if needed
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

    // Generate and store embedding for the property (async, don't block response)
    upsertPropertyEmbedding(property.id).catch((err) =>
      console.error(
        `Failed to generate embedding for property ${property.id}:`,
        err
      )
    );

    // Track creation for analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: "property_created",
        userId,
        propertyId: property.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create property. Please try again.",
    });
  }
};

/**
 * PUT /api/properties/:id
 * Update an existing property (Landlord or Admin only)
 */
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required to update property",
      });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid property ID format",
        message: "Property ID must be a valid string",
      });
    }

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: "Property not found",
        message: `Property with ID ${propertyId} does not exist`,
      });
    }

    // Authorization check
    if (existingProperty.landlordId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== "ADMIN") {
        return res.status(403).json({
          error: "Forbidden",
          message: "You don't have permission to update this property",
        });
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

    // Regenerate embedding after update
    upsertPropertyEmbedding(property.id).catch((err) =>
      console.error(
        `Failed to regenerate embedding for property ${property.id}:`,
        err
      )
    );

    res.json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update property. Please try again.",
    });
  }
};

/**
 * DELETE /api/properties/:id
 * Delete a property (Landlord or Admin only)
 */
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required to delete property",
      });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid property ID format",
        message: "Property ID must be a valid string",
      });
    }

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: "Property not found",
        message: `Property with ID ${propertyId} does not exist`,
      });
    }

    // Authorization check
    if (existingProperty.landlordId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== "ADMIN") {
        return res.status(403).json({
          error: "Forbidden",
          message: "You don't have permission to delete this property",
        });
      }
    }

    // Delete property (cascade will handle related records)
    await prisma.property.delete({
      where: { id: propertyId },
    });

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete property. Please try again.",
    });
  }
};

/**
 * PATCH /api/properties/:id/toggle
 * Toggle property availability (activate/deactivate)
 */
export const togglePropertyAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required to toggle property status",
      });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid property ID format",
        message: "Property ID must be a valid string",
      });
    }

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: "Property not found",
        message: `Property with ID ${propertyId} does not exist`,
      });
    }

    if (existingProperty.landlordId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You don't have permission to modify this property",
      });
    }

    // Toggle isActive
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        isActive: !existingProperty.isActive,
      },
    });

    res.json({
      success: true,
      message: `Property ${
        property.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: property.isActive,
    });
  } catch (error) {
    console.error("Error toggling property availability:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to toggle property status. Please try again.",
    });
  }
};

/**
 * GET /api/properties/:id/analytics
 * Get property analytics (views, leads, visits) - Landlord only
 */
export const getPropertyAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required to view analytics",
      });
    }

    let propertyId: string;
    try {
      propertyId = validatePropertyId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid property ID format",
        message: "Property ID must be a valid string",
      });
    }

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({
        error: "Property not found",
        message: `Property with ID ${propertyId} does not exist`,
      });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message:
          "You don't have permission to view analytics for this property",
      });
    }

    // Get analytics data
    const [views, leads, visits] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          propertyId,
          eventType: "property_view",
        },
      }),
      prisma.lead.count({
        where: { propertyId },
      }),
      prisma.visitSchedule.count({
        where: { propertyId },
      }),
    ]);

    // Get daily views for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyViews = await prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT 
        DATE("created_at") as date,
        COUNT(*) as count
      FROM "urbankey"."analytics_events"
      WHERE 
        "property_id" = ${propertyId}
        AND "event_type" = 'property_view'
        AND "created_at" >= ${sevenDaysAgo}
      GROUP BY DATE("created_at")
      ORDER BY DATE("created_at") DESC
    `;

    const formattedDailyViews = dailyViews.map((d) => ({
      date: d.date.toISOString(),
      count: Number(d.count),
    }));

    res.json({
      success: true,
      analytics: {
        totalViews: views,
        totalLeads: leads,
        totalVisits: visits,
        dailyViews: formattedDailyViews,
      },
    });
  } catch (error) {
    console.error("Error fetching property analytics:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch property analytics",
    });
  }
};
