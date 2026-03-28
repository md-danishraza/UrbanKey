import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getRecentLeads,
} from "../controllers/landlordDashboard.controller.js";

const router = Router();

// All dashboard routes require authentication
router.use(requireAuth);

router.get("/stats", getDashboardStats);
router.get("/leads", getRecentLeads);

export default router;
