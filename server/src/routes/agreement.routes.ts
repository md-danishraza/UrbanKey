import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createAgreement,
  getLandlordAgreements,
  getTenantAgreements,
  getAgreementById,
  signAgreement,
  getAgreementPDF,
} from "../controllers/agreement.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Agreement CRUD
router.post("/", createAgreement);
router.get("/landlord", getLandlordAgreements);
router.get("/tenant", getTenantAgreements);
router.get("/:id", getAgreementById);
router.get("/:id/pdf", getAgreementPDF);
router.post("/:id/sign", signAgreement);

export default router;
