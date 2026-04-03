import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  acceptLandlordAgreement,
  getAgreementStatus,
} from "../controllers/onBoardingAgreement.controller.js";

const router = Router();

// All agreement routes require authentication
router.use(requireAuth);

// Landlord agreement routes
router.post(
  "/landlord",
  requireRole(["LANDLORD", "ADMIN"]),
  acceptLandlordAgreement
);
router.get("/landlord", requireRole(["LANDLORD", "ADMIN"]), getAgreementStatus);

export default router;
