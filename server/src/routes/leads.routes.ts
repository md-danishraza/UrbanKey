import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createLead,
  getLandlordLeads,
  getTenantLeads,
  updateLeadStatus,
} from "../controllers/lead.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Tenant routes
router.post("/", createLead);
router.get("/my-leads", getTenantLeads);

// Landlord routes
router.get("/landlord", getLandlordLeads);
router.patch("/:leadId/status", updateLeadStatus);

export default router;
