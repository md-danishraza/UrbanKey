import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  createVisit,
  getLandlordVisits,
  getTenantVisits,
  updateVisitStatus,
} from "../controllers/visit.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Tenant routes
router.post("/", requireRole(["TENANT"]), createVisit);
router.get("/my-visits", getTenantVisits);

// Landlord routes
router.get("/landlord", getLandlordVisits);
router.patch("/:visitId/status", requireRole(["LANDLORD"]), updateVisitStatus);

export default router;
