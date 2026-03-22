import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getPendingVerifications,
  getAllVerifications,
  getVerificationStats,
  approveDocument,
  rejectDocument,
  getDocumentById,
} from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

// Verification routes
router.get("/verifications/pending", getPendingVerifications);
router.get("/verifications/all", getAllVerifications);
router.get("/verifications/stats", getVerificationStats);
router.get("/verifications/:documentId", getDocumentById);
router.post("/verifications/:documentId/approve", approveDocument);
router.post("/verifications/:documentId/reject", rejectDocument);

export default router;
