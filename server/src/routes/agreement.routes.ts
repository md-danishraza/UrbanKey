import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateCreateAgreement,
  validateAgreementId,
  validateAgreementFilters,
} from "../validations/agreement-payment.validations.js";
import {
  createAgreement,
  getLandlordAgreements,
  getTenantAgreements,
  getAgreementById,
  signAgreement,
  getAgreementPDF,
  getTenantCurrentRental,
} from "../controllers/agreement.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Agreements
 *   description: Rental agreement management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RentalAgreement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         agreementNumber:
 *           type: string
 *           example: "AGR/2024/0001"
 *         propertyId:
 *           type: string
 *         tenantId:
 *           type: string
 *         landlordId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         monthlyRent:
 *           type: number
 *         securityDeposit:
 *           type: number
 *         maintenanceFee:
 *           type: number
 *         terms:
 *           type: string
 *         specialConditions:
 *           type: string
 *         status:
 *           type: string
 *           enum: [DRAFT, PENDING_SIGNATURE, ACTIVE, EXPIRED, TERMINATED]
 *         signedByTenant:
 *           type: boolean
 *         signedByLandlord:
 *           type: boolean
 *         signedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         property:
 *           $ref: '#/components/schemas/Property'
 *         tenant:
 *           $ref: '#/components/schemas/User'
 *         landlord:
 *           $ref: '#/components/schemas/User'
 *
 *     CreateAgreementRequest:
 *       type: object
 *       required:
 *         - propertyId
 *         - tenantId
 *         - startDate
 *         - endDate
 *         - monthlyRent
 *         - securityDeposit
 *       properties:
 *         propertyId:
 *           type: string
 *         tenantId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         monthlyRent:
 *           type: number
 *           example: 25000
 *         securityDeposit:
 *           type: number
 *           example: 50000
 *         maintenanceFee:
 *           type: number
 *           example: 2000
 *         terms:
 *           type: string
 *         specialConditions:
 *           type: string
 *
 *     SignAgreementRequest:
 *       type: object
 *       properties: {}
 *
 *     AgreementListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         agreements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RentalAgreement'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 */

// ==================== AGREEMENT CRUD ====================

/**
 * @swagger
 * /rent/agreements:
 *   post:
 *     summary: Create a new rental agreement
 *     description: Landlord creates a rental agreement for a tenant
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAgreementRequest'
 *     responses:
 *       201:
 *         description: Agreement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agreement:
 *                   $ref: '#/components/schemas/RentalAgreement'
 *       400:
 *         description: Validation error or property already occupied
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not property owner
 *       404:
 *         description: Property or tenant not found
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateCreateAgreement(),
  validateRequest,
  createAgreement
);

/**
 * @swagger
 * /rent/agreements/landlord:
 *   get:
 *     summary: Get landlord's agreements
 *     description: Returns all rental agreements for properties owned by the landlord
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PENDING_SIGNATURE, ACTIVE, EXPIRED, TERMINATED, ALL]
 *         description: Filter by agreement status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Agreements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AgreementListResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/landlord",
  ...validateAgreementFilters(),
  validateRequest,
  getLandlordAgreements
);

/**
 * @swagger
 * /rent/agreements/tenant:
 *   get:
 *     summary: Get tenant's agreements
 *     description: Returns all rental agreements for the authenticated tenant
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agreements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agreements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RentalAgreement'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/tenant", getTenantAgreements);

/**
 * @swagger
 * /rent/agreements/tenant/current:
 *   get:
 *     summary: Get tenant's current rental
 *     description: Returns the tenant's current active or pending rental agreement
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current rental retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agreement:
 *                   $ref: '#/components/schemas/RentalAgreement'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/tenant/current", getTenantCurrentRental);

/**
 * @swagger
 * /rent/agreements/{id}:
 *   get:
 *     summary: Get agreement by ID
 *     description: Returns detailed information about a specific agreement
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Agreement ID
 *     responses:
 *       200:
 *         description: Agreement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agreement:
 *                   $ref: '#/components/schemas/RentalAgreement'
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
router.get("/:id", ...validateAgreementId(), validateRequest, getAgreementById);

/**
 * @swagger
 * /rent/agreements/{id}/pdf:
 *   get:
 *     summary: Get agreement PDF
 *     description: Returns the agreement data for PDF generation
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Agreement ID
 *     responses:
 *       200:
 *         description: Agreement PDF data retrieved
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
router.get(
  "/:id/pdf",
  ...validateAgreementId(),
  validateRequest,
  getAgreementPDF
);

/**
 * @swagger
 * /rent/agreements/{id}/sign:
 *   post:
 *     summary: Sign agreement
 *     description: Tenant signs the rental agreement
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Agreement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignAgreementRequest'
 *     responses:
 *       200:
 *         description: Agreement signed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agreement:
 *                   $ref: '#/components/schemas/RentalAgreement'
 *       400:
 *         description: Invalid agreement ID or cannot be signed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the tenant
 *       404:
 *         description: Agreement not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:id/sign",
  ...validateAgreementId(),
  validateRequest,
  signAgreement
);

export default router;
