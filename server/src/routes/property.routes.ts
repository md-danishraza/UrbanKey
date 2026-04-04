import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  togglePropertyAvailability,
  semanticSearchProperties,
  getPropertyAnalytics,
  getStats,
} from "../controllers/property.controller.js";

const router = Router();

// Public routes
router.get("/", getAllProperties);

router.get("/semantic", semanticSearchProperties);
// landing hero section stats
router.get("/stats", getStats);
router.get("/:id", getPropertyById);

// Protected routes
router.use(requireAuth);
router.post("/", requireRole(["LANDLORD", "ADMIN"]), createProperty);
router.put("/:id", requireRole(["LANDLORD", "ADMIN"]), updateProperty);
router.delete("/:id", requireRole(["LANDLORD", "ADMIN"]), deleteProperty);
router.patch(
  "/:id/toggle",
  requireRole(["LANDLORD", "ADMIN"]),
  togglePropertyAvailability
);
router.get(
  "/:id/analytics",
  requireRole(["LANDLORD", "ADMIN"]),
  getPropertyAnalytics
);

export default router;
