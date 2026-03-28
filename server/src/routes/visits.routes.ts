import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
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
router.post("/", createVisit);
router.get("/my-visits", getTenantVisits);

// Landlord routes
router.get("/landlord", getLandlordVisits);
router.patch("/:visitId/status", updateVisitStatus);

export default router;
