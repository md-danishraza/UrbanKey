import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Save onboarding progress
export const saveOnboardingProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { step, completedSteps, data } = req.body;

    // Update or create onboarding progress
    const progress = await prisma.onboardingProgress.upsert({
      where: { userId },
      update: {
        currentStep: step,
        completedSteps,
        data: data || {},
        updatedAt: new Date(),
      },
      create: {
        userId,
        currentStep: step,
        completedSteps,
        data: data || {},
      },
    });

    res.json({ success: true, progress });
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get onboarding progress
// Get onboarding progress
export const getOnboardingProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    console.log(progress);

    // Always return a consistent response structure
    res.json({
      success: true,
      progress: progress || null,
    });
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
// Complete onboarding
export const completeOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { role } = req.body;

    // 1. Update user role (Removed the invalid field)
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: role.toUpperCase(),
      },
    });

    // 2. Mark onboarding as completed in the correct table
    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if user has completed onboarding
export const checkOnboardingStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    // Also check if user exists and has completed flag
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true },
    });

    res.json({
      success: true,
      completed: progress?.completed || user?.onboardingCompleted || false,
      progress: progress || null,
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
