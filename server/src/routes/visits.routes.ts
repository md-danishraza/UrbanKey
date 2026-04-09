import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateCreateVisit,
  validateUpdateVisitStatus,
  validateVisitFilters,
} from "../validations/interaction.validations.js";
import {
  createVisit,
  getLandlordVisits,
  getTenantVisits,
  updateVisitStatus,
} from "../controllers/visit.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Property visit scheduling and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         propertyId:
 *           type: string
 *         tenantId:
 *           type: string
 *         scheduledDate:
 *           type: string
 *           format: date
 *         scheduledTime:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *         notes:
 *           type: string
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
 *     CreateVisitRequest:
 *       type: object
 *       required:
 *         - propertyId
 *         - scheduledDate
 *         - scheduledTime
 *       properties:
 *         propertyId:
 *           type: string
 *           example: "cm5zj87d0000wk55xapojt75"
 *         scheduledDate:
 *           type: string
 *           format: date
 *           example: "2024-12-15"
 *         scheduledTime:
 *           type: string
 *           pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
 *           example: "10:30"
 *         notes:
 *           type: string
 *           example: "I would like to see the master bedroom"
 *
 *     UpdateVisitStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 */

// ==================== TENANT ROUTES ====================

/**
 * @swagger
 * /visits:
 *   post:
 *     summary: Schedule a property visit
 *     description: Tenant schedules a visit to a property
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVisitRequest'
 *     responses:
 *       201:
 *         description: Visit scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 visit:
 *                   $ref: '#/components/schemas/Visit'
 *       400:
 *         description: Validation error (past date, invalid time, etc.)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  requireRole(["TENANT", "ADMIN"]),
  ...validateCreateVisit(),
  validateRequest,
  createVisit
);

/**
 * @swagger
 * /visits/my-visits:
 *   get:
 *     summary: Get tenant's visits
 *     description: Returns all visits scheduled by the authenticated tenant
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Visits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 visits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Visit'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-visits", getTenantVisits);

// ==================== LANDLORD ROUTES ====================

/**
 * @swagger
 * /visits/landlord:
 *   get:
 *     summary: Get landlord's visit requests
 *     description: Returns all visit requests for properties owned by the authenticated landlord
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED, ALL]
 *         description: Filter by visit status
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter by specific property
 *     responses:
 *       200:
 *         description: Visits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 visits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Visit'
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
  ...validateVisitFilters(),
  validateRequest,
  getLandlordVisits
);

/**
 * @swagger
 * /visits/{visitId}/status:
 *   patch:
 *     summary: Update visit status
 *     description: Landlord updates the status of a visit request
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitId
 *         schema:
 *           type: string
 *         required: true
 *         description: Visit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVisitStatusRequest'
 *     responses:
 *       200:
 *         description: Visit status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 visit:
 *                   $ref: '#/components/schemas/Visit'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the property owner
 *       404:
 *         description: Visit not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:visitId/status",
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateUpdateVisitStatus(),
  validateRequest,
  updateVisitStatus
);

export default router;
