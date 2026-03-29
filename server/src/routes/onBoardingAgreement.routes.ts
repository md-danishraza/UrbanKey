import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  acceptLandlordAgreement,
  getAgreementStatus,
} from "../controllers/onBoardingAgreement.controller.js";

const router = Router();

// All agreement routes require authentication
router.use(requireAuth);

// Landlord agreement routes
router.post("/landlord", acceptLandlordAgreement);
router.get("/landlord", getAgreementStatus);

export default router;
