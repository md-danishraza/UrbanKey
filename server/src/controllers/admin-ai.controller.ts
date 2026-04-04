import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import { askQuestion } from "../services/rag.service.js";

// Get AI-powered analytics using existing RAG service
export const getAIAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { query, type = "general" } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required" });
    }

    // Use the existing RAG service
    const result = await askQuestion(query, req.auth?.userId);

    // Extract insights from the answer (optional)
    const insights = extractInsights(result.answer);

    res.json({
      success: true,
      answer: result.answer,
      insights,
      properties: result.properties,
    });
  } catch (error) {
    console.error("Error in AI analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get quick stats for dashboard
export const getQuickStats = async (req: AuthRequest, res: Response) => {
  try {
    const [mostSearchedArea, averageRent2BHK, highestDemand, responseRate] =
      await Promise.all([
        getMostSearchedArea(),
        getAverageRentByBHK("TWO_BHK"),
        getHighestDemand(),
        calculateResponseRate(),
      ]);

    res.json({
      success: true,
      mostSearchedArea,
      averageRent2BHK,
      highestDemand,
      responseRate,
    });
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper functions with fixed type errors
async function getMostSearchedArea(): Promise<string> {
  try {
    const searches = await prisma.analyticsEvent.findMany({
      where: { eventType: "search" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Count occurrences of cities in search queries
    const cityCount: Record<string, number> = {};
    searches.forEach((search) => {
      // Safely access metadata as JsonValue
      const metadata = search.metadata as Record<string, any> | null;
      if (metadata?.city && typeof metadata.city === "string") {
        const city = metadata.city;
        cityCount[city] = (cityCount[city] || 0) + 1;
      }
    });

    const topCity = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0];
    return topCity ? topCity[0] : "Whitefield";
  } catch (error) {
    console.error("Error getting most searched area:", error);
    return "Whitefield";
  }
}

async function getAverageRentByBHK(bhk: string): Promise<number> {
  try {
    // Convert string to proper BHKType enum
    const bhkMap: Record<string, any> = {
      ONE_BHK: "ONE_BHK",
      TWO_BHK: "TWO_BHK",
      THREE_BHK: "THREE_BHK",
      FOUR_BHK_PLUS: "FOUR_BHK_PLUS",
    };

    const result = await prisma.property.aggregate({
      where: { bhk: bhkMap[bhk] as any, isActive: true },
      _avg: { rent: true },
    });
    return Math.round(result._avg.rent || 28500);
  } catch (error) {
    console.error("Error getting average rent:", error);
    return 28500;
  }
}

async function getHighestDemand(): Promise<string> {
  try {
    // Get leads grouped by property with proper ordering
    const leadsByFurnishing = await prisma.lead.groupBy({
      by: ["propertyId"],
      _count: true,
      orderBy: { _count: { propertyId: "desc" } },
      take: 100,
    });

    // Get property details for top leads
    const propertyIds = leadsByFurnishing.map((l) => l.propertyId);
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: { furnishing: true },
    });

    const furnishingCount: Record<string, number> = {};
    properties.forEach((p) => {
      const furnishing = p.furnishing;
      furnishingCount[furnishing] = (furnishingCount[furnishing] || 0) + 1;
    });

    const topFurnishing = Object.entries(furnishingCount).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const furnishingMap: Record<string, string> = {
      FULLY_FURNISHED: "Fully Furnished",
      SEMI_FURNISHED: "Semi-Furnished",
      UNFURNISHED: "Unfurnished",
    };

    if (topFurnishing && topFurnishing[0]) {
      return furnishingMap[topFurnishing[0]] || "Fully Furnished";
    }
    return "Fully Furnished";
  } catch (error) {
    console.error("Error getting highest demand:", error);
    return "Fully Furnished";
  }
}

async function calculateResponseRate(): Promise<number> {
  try {
    const totalLeads = await prisma.lead.count();
    const respondedLeads = await prisma.lead.count({
      where: { status: { in: ["CONTACTED", "CONVERTED"] } },
    });
    return totalLeads > 0 ? Math.round((respondedLeads / totalLeads) * 100) : 0;
  } catch (error) {
    console.error("Error calculating response rate:", error);
    return 0;
  }
}

function extractInsights(answer: string): any {
  // Simple extraction of key points (can be enhanced)
  const sentences = answer.split(/[.!?]+/);
  const trends = sentences.slice(0, 3).filter((s) => s.length > 20);
  const recommendations = sentences.slice(3, 6).filter((s) => s.length > 20);

  return {
    trends: trends.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
  };
}
