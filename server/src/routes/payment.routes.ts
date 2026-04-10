import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateRecordPayment,
  validateUpdatePaymentStatus,
  // validatePaymentId,
} from "../validations/agreement-payment.validations.js";
import {
  recordPayment,
  getPayments,
  updatePaymentStatus,
  getPaymentSummary,
} from "../controllers/payment.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Rent payment tracking and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         agreementId:
 *           type: string
 *         amount:
 *           type: number
 *         month:
 *           type: integer
 *         year:
 *           type: integer
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *           enum: [RENT, SECURITY_DEPOSIT, MAINTENANCE, LATE_FEE, OTHER]
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, OVERDUE, REFUNDED]
 *         description:
 *           type: string
 *         transactionId:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, BANK_TRANSFER, UPI, CHEQUE, OTHER]
 *         notes:
 *           type: string
 *         recordedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RecordPaymentRequest:
 *       type: object
 *       required:
 *         - agreementId
 *         - amount
 *         - paymentDate
 *       properties:
 *         agreementId:
 *           type: string
 *         amount:
 *           type: number
 *         paymentDate:
 *           type: string
 *           format: date
 *         type:
 *           type: string
 *           enum: [RENT, SECURITY_DEPOSIT, MAINTENANCE, LATE_FEE, OTHER]
 *           default: RENT
 *         month:
 *           type: integer
 *         year:
 *           type: integer
 *         description:
 *           type: string
 *         transactionId:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, BANK_TRANSFER, UPI, CHEQUE, OTHER]
 *           default: CASH
 *         notes:
 *           type: string
 *
 *     UpdatePaymentStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, OVERDUE, REFUNDED]
 *
 *     PaymentSummary:
 *       type: object
 *       properties:
 *         totalMonthlyCollection:
 *           type: number
 *         totalPending:
 *           type: number
 *         totalPaid:
 *           type: number
 *         agreements:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               propertyTitle:
 *                 type: string
 *               tenantName:
 *                 type: string
 *               monthlyRent:
 *                 type: number
 *               pendingAmount:
 *                 type: number
 *               paidAmount:
 *                 type: number
 */

// ==================== PAYMENT CRUD ====================

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Record a payment
 *     description: Landlord records a rent payment from a tenant
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordPaymentRequest'
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the agreement owner
 *       404:
 *         description: Agreement not found
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateRecordPayment(),
  validateRequest,
  recordPayment
);

/**
 * @swagger
 * /payments/summary:
 *   get:
 *     summary: Get payment summary for landlord
 *     description: Returns payment summary for all active agreements of the landlord
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 summary:
 *                   $ref: '#/components/schemas/PaymentSummary'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/summary", getPaymentSummary);

/**
 * @swagger
 * /payments/agreement/{agreementId}:
 *   get:
 *     summary: Get payments for agreement
 *     description: Returns all payments for a specific rental agreement
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agreementId
 *         schema:
 *           type: string
 *         required: true
 *         description: Agreement ID
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid agreement ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Agreement not found
 *       500:
 *         description: Server error
 */
router.get("/agreement/:agreementId", getPayments);

/**
 * @swagger
 * /payments/{id}:
 *   patch:
 *     summary: Update payment status
 *     description: Landlord updates the status of a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePaymentStatusRequest'
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid payment ID or status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id",
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateUpdatePaymentStatus(),
  validateRequest,
  updatePaymentStatus
);

export default router;
