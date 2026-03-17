import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  saveOnboardingProgress,
  getOnboardingProgress,
  completeOnboarding,
} from "../controllers/onboarding.controller.js";

const router = Router();

// All onboarding routes require authentication
router.use(requireAuth);

router.post("/progress", saveOnboardingProgress);
router.get("/progress", getOnboardingProgress);
router.post("/complete", completeOnboarding);

export default router;
