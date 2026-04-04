import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  getPendingVerifications,
  getAllVerifications,
  getVerificationStats,
  approveDocument,
  rejectDocument,
  getDocumentById,
  getUserStats,
  getPropertyStats,
  getMonthlyActiveUsers,
  getAdminProperties,
  getAdminPropertyStats,
  updatePropertyStatus,
  deletePropertyAdmin,
  getAdminUsers,
  getAdminUserStats,
  updateUserRole,
  verifyUser,
  deleteUser,
} from "../controllers/admin.controller.js";
import {
  getAIAnalytics,
  getQuickStats,
} from "../controllers/admin-ai.controller.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["ADMIN"]));

//Adhar Verification routes
router.get("/verifications/pending", getPendingVerifications);
router.get("/verifications/all", getAllVerifications);
router.get("/verifications/stats", getVerificationStats);
router.get("/verifications/:documentId", getDocumentById);
router.post("/verifications/:documentId/approve", approveDocument);
router.post("/verifications/:documentId/reject", rejectDocument);

//Dashboard  Platform stats routes
router.get("/dashboard/users/stats", getUserStats);
router.get("/dashboard/properties/stats", getPropertyStats);
router.get("/analytics/monthly-active", getMonthlyActiveUsers);

// Properties mgt
router.get("/properties", getAdminProperties);
router.get("/properties/stats", getAdminPropertyStats);
router.patch("/properties/:propertyId/status", updatePropertyStatus);
// with all images
router.delete("/properties/:propertyId", deletePropertyAdmin);

// User mgt routes
router.get("/users", getAdminUsers);
router.get("/users/stats", getAdminUserStats);
router.patch("/users/:userId/role", updateUserRole);
router.patch("/users/:userId/verify", verifyUser);
router.delete("/users/:userId", deleteUser);

// Ai analytics
router.post("/ai/analyze", getAIAnalytics);
router.get("/ai/quick-stats", getQuickStats);

export default router;
