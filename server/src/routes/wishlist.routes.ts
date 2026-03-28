import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
  getWishlistCount,
} from "../controllers/wishlist.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get wishlist and count
router.get("/", getWishlist);
router.get("/count", getWishlistCount);

// Check specific property status
router.get("/:propertyId/status", checkWishlistStatus);

// Add/remove from wishlist
router.post("/:propertyId", addToWishlist);
router.delete("/:propertyId", removeFromWishlist);

export default router;
