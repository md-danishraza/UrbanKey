import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Save landlord agreement acceptance
export const acceptLandlordAgreement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { acceptedAt, terms, ipAddress } = req.body;

    // Get user to ensure they are a landlord
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save agreement acceptance in database
    const agreement = await prisma.landlordAgreement.upsert({
      where: { userId },
      update: {
        acceptedAt: new Date(acceptedAt),
        termsVersion: terms,
        ipAddress,
        updatedAt: new Date(),
      },
      create: {
        userId,
        acceptedAt: new Date(acceptedAt),
        termsVersion: terms,
        ipAddress,
      },
    });

    res.json({
      success: true,
      agreement: {
        id: agreement.id,
        acceptedAt: agreement.acceptedAt,
        termsVersion: agreement.termsVersion,
      },
      message: "Agreement accepted successfully",
    });
  } catch (error) {
    console.error("Error saving agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get landlord agreement status
export const getAgreementStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const agreement = await prisma.landlordAgreement.findUnique({
      where: { userId },
    });

    res.json({
      success: true,
      hasAccepted: !!agreement,
      agreement: agreement || null,
    });
  } catch (error) {
    console.error("Error fetching agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Save tenant agreement acceptance
export const acceptTenantAgreement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { acceptedAt, terms, ipAddress } = req.body;

    // Get user to ensure they are a tenant
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save agreement acceptance in database
    const agreement = await prisma.tenantAgreement.upsert({
      where: { userId },
      update: {
        acceptedAt: new Date(acceptedAt),
        termsVersion: terms,
        ipAddress,
        updatedAt: new Date(),
      },
      create: {
        userId,
        acceptedAt: new Date(acceptedAt),
        termsVersion: terms,
        ipAddress,
      },
    });

    res.json({
      success: true,
      agreement: {
        id: agreement.id,
        acceptedAt: agreement.acceptedAt,
        termsVersion: agreement.termsVersion,
      },
      message: "Tenant agreement accepted successfully",
    });
  } catch (error) {
    console.error("Error saving tenant agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get tenant agreement status
export const getTenantAgreementStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const agreement = await prisma.tenantAgreement.findUnique({
      where: { userId },
    });

    res.json({
      success: true,
      hasAccepted: !!agreement,
      agreement: agreement || null,
    });
  } catch (error) {
    console.error("Error fetching tenant agreement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
