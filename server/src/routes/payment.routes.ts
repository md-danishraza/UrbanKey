import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  recordPayment,
  getPayments,
  updatePaymentStatus,
  getPaymentSummary,
} from "../controllers/payment.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.post("/", requireRole(["LANDLORD", "ADMIN"]), recordPayment);
router.get("/summary", getPaymentSummary);
router.get("/agreement/:agreementId", getPayments);
router.patch("/:id", requireRole(["LANDLORD", "ADMIN"]), updatePaymentStatus);

export default router;
