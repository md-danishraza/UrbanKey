import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createAgreement,
  getLandlordAgreements,
  getTenantAgreements,
  getAgreementById,
  signAgreement,
  getAgreementPDF,
  getTenantCurrentRental,
} from "../controllers/agreement.controller.js";
import { requireRole } from "../middleware/auth.middleware.js";
const router = Router();

// All routes require authentication
router.use(requireAuth);

// Agreement CRUD
router.post("/", requireRole(["LANDLORD", "ADMIN"]), createAgreement);
router.get("/landlord", getLandlordAgreements);
router.get("/tenant", getTenantAgreements);
router.get("/tenant/current", getTenantCurrentRental);
router.get("/:id", getAgreementById);
router.get("/:id/pdf", getAgreementPDF);
router.post("/:id/sign", signAgreement);

export default router;
