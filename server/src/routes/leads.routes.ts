import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
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
router.post("/", requireRole(["TENANT", "ADMIN"]), createLead);
router.get("/my-leads", requireRole(["TENANT", "ADMIN"]), getTenantLeads);

// Landlord routes
router.get("/landlord", requireRole(["LANDLORD", "ADMIN"]), getLandlordLeads);
router.patch(
  "/:leadId/status",
  requireRole(["LANDLORD,ADMIN"]),
  updateLeadStatus
);

export default router;
