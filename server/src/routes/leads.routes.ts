import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateCreateLead,
  validateUpdateLeadStatus,
  validateLeadFilters,
} from "../validations/interaction.validations.js";
import {
  createLead,
  getLandlordLeads,
  getTenantLeads,
  updateLeadStatus,
} from "../controllers/lead.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Tenant enquiry and lead management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         propertyId:
 *           type: string
 *         tenantId:
 *           type: string
 *         message:
 *           type: string
 *         contactMethod:
 *           type: string
 *           enum: [WHATSAPP, PHONE, EMAIL]
 *         status:
 *           type: string
 *           enum: [NEW, CONTACTED, CONVERTED, CLOSED]
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
 *
 *     CreateLeadRequest:
 *       type: object
 *       required:
 *         - propertyId
 *         - message
 *       properties:
 *         propertyId:
 *           type: string
 *           example: "cm5zj87d0000wk55xapojt75"
 *         message:
 *           type: string
 *           example: "Is this property still available? I would like to schedule a visit."
 *         contactMethod:
 *           type: string
 *           enum: [WHATSAPP, PHONE, EMAIL]
 *           default: WHATSAPP
 *
 *     UpdateLeadStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [NEW, CONTACTED, CONVERTED, CLOSED]
 *
 *     LeadsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         leads:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lead'
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

// ==================== TENANT ROUTES ====================

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead/enquiry
 *     description: Tenant creates an enquiry about a property
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeadRequest'
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  requireRole(["TENANT", "ADMIN"]),
  ...validateCreateLead(),
  validateRequest,
  createLead
);

/**
 * @swagger
 * /leads/my-leads:
 *   get:
 *     summary: Get tenant's leads
 *     description: Returns all enquiries made by the authenticated tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 leads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-leads", requireRole(["TENANT", "ADMIN"]), getTenantLeads);

// ==================== LANDLORD ROUTES ====================

/**
 * @swagger
 * /leads/landlord:
 *   get:
 *     summary: Get landlord's leads
 *     description: Returns all enquiries for properties owned by the authenticated landlord
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, CONTACTED, CONVERTED, CLOSED, ALL]
 *         description: Filter by lead status
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter by specific property
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeadsListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a landlord
 *       500:
 *         description: Server error
 */
router.get(
  "/landlord",
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateLeadFilters(),
  validateRequest,
  getLandlordLeads
);

/**
 * @swagger
 * /leads/{leadId}/status:
 *   patch:
 *     summary: Update lead status
 *     description: Landlord updates the status of a lead (NEW, CONTACTED, CONVERTED, CLOSED)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLeadStatusRequest'
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the property owner
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:leadId/status",
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateUpdateLeadStatus(),
  validateRequest,
  updateLeadStatus
);

export default router;
