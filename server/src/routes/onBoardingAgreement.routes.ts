import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  acceptLandlordAgreement,
  acceptTenantAgreement,
  getAgreementStatus,
  getTenantAgreementStatus,
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

// Tenant agreement routes
router.post("/tenant", requireRole(["TENANT", "ADMIN"]), acceptTenantAgreement);
router.get(
  "/tenant",
  requireRole(["TENANT", "ADMIN"]),
  getTenantAgreementStatus
);

export default router;
