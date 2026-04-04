// # User endpoints
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  syncUser,
  getLandlordProperties,
  isLandlordVerified,
} from "../controllers/user.controller.js";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// Current user routes
router.post("/sync", syncUser);
router.get("/me", getCurrentUser);
router.put("/me", updateUser);
router.delete("/me", deleteUser);

router.get("/landlord/me", requireAuth, getLandlordProperties);
// is landlord verified?
router.get("/landlord/isVerified", isLandlordVerified);

// User specific routes
router.get("/:userId", getUserById);

export default router;
