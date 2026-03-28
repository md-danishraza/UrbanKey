// # User endpoints
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserProperties,
  getUserWishlist,
  getUserVisits,
  getUserLeads,
  syncUser,
  getLandlordProperties,
} from "../controllers/user.controller.js";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// Current user routes
router.post("/sync", syncUser);
router.get("/me", getCurrentUser);
router.put("/me", updateUser);
router.delete("/me", deleteUser);

// User specific routes
router.get("/:userId", getUserById);
router.get("/:userId/properties", getUserProperties);
router.get("/:userId/wishlist", getUserWishlist);
router.get("/:userId/visits", getUserVisits);
router.get("/:userId/leads", getUserLeads);
router.get("/landlord/me", requireAuth, getLandlordProperties);

export default router;
