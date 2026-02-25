import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  togglePropertyAvailability,
  searchProperties,
} from "../controllers/property.controller.js";

const router = Router();

// Public routes
router.get("/", getAllProperties);
router.get("/search", searchProperties);
router.get("/:id", getPropertyById);

// Protected routes
router.post("/", requireAuth, createProperty);
router.put("/:id", requireAuth, updateProperty);
router.delete("/:id", requireAuth, deleteProperty);
router.patch("/:id/toggle", requireAuth, togglePropertyAvailability);

export default router;
