import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateId,
  validatePagination,
  validateSearchQuery,
  validateCity,
  validateRentRange,
  validateBHK,
  validatePropertyData,
} from "../validations/common.validations.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  togglePropertyAvailability,
  semanticSearchProperties,
  getPropertyAnalytics,
  getStats,
} from "../controllers/property.controller.js";

const router = Router();

// ==================== SWAGGER DOCUMENTATION ====================

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management endpoints - Search, view, and manage rental properties
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - title
 *         - bhk
 *         - rent
 *         - furnishing
 *         - tenantType
 *         - addressLine1
 *         - city
 *         - state
 *         - pincode
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated property ID
 *           example: "cm5zj87d0000wk55xapojt75"
 *         title:
 *           type: string
 *           description: Property title
 *           example: "Modern 2BHK in Whitefield"
 *         description:
 *           type: string
 *           description: Detailed property description
 *           example: "Spacious apartment with modern amenities..."
 *         bhk:
 *           type: string
 *           enum: [ONE_BHK, TWO_BHK, THREE_BHK, FOUR_BHK_PLUS]
 *           description: BHK type
 *           example: "TWO_BHK"
 *         rent:
 *           type: number
 *           description: Monthly rent in INR
 *           example: 25000
 *         furnishing:
 *           type: string
 *           enum: [UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED]
 *           example: "SEMI_FURNISHED"
 *         tenantType:
 *           type: string
 *           enum: [FAMILY, BACHELORS, BOTH]
 *           example: "FAMILY"
 *         isActive:
 *           type: boolean
 *           default: true
 *         isBroker:
 *           type: boolean
 *           default: false
 *         brokerageFee:
 *           type: number
 *           description: Brokerage fee if applicable
 *         addressLine1:
 *           type: string
 *           example: "123, Oakwood Residency"
 *         addressLine2:
 *           type: string
 *           example: "Whitefield Main Road"
 *         city:
 *           type: string
 *           example: "Bangalore"
 *         state:
 *           type: string
 *           example: "Karnataka"
 *         pincode:
 *           type: string
 *           example: "560066"
 *         latitude:
 *           type: number
 *           format: float
 *         longitude:
 *           type: number
 *           format: float
 *         hasWater247:
 *           type: boolean
 *           default: false
 *         hasPowerBackup:
 *           type: boolean
 *           default: false
 *         hasIglPipeline:
 *           type: boolean
 *           default: false
 *         nearestMetroStation:
 *           type: string
 *           example: "Baiyappanahalli"
 *         distanceToMetroKm:
 *           type: number
 *           format: float
 *           example: 1.2
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PropertyImage'
 *         landlord:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PropertyImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         imageUrl:
 *           type: string
 *         isPrimary:
 *           type: boolean
 *         sortOrder:
 *           type: integer
 *
 *     PropertyListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Property'
 *         total:
 *           type: integer
 *           example: 50
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 5
 *
 *     PropertyAnalytics:
 *       type: object
 *       properties:
 *         totalViews:
 *           type: integer
 *           example: 156
 *         totalLeads:
 *           type: integer
 *           example: 12
 *         totalVisits:
 *           type: integer
 *           example: 5
 *         dailyViews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               count:
 *                 type: integer
 *
 *     PlatformStats:
 *       type: object
 *       properties:
 *         totalProperties:
 *           type: integer
 *           example: 150
 *         totalTenants:
 *           type: integer
 *           example: 380
 *         totalLandlords:
 *           type: integer
 *           example: 52
 *         totalAgreements:
 *           type: integer
 *           example: 45
 */

// ==================== PUBLIC ROUTES ====================

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties with filtering
 *     description: Retrieve a paginated list of properties with optional filters. Supports filtering by city, rent range, BHK type, furnishing, amenities, and more.
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city name
 *         example: "Bangalore"
 *       - in: query
 *         name: minRent
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum rent amount
 *         example: 10000
 *       - in: query
 *         name: maxRent
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum rent amount
 *         example: 50000
 *       - in: query
 *         name: bhk
 *         schema:
 *           type: string
 *         description: Comma-separated BHK types (1BHK,2BHK,3BHK,4BHK+)
 *         example: "2BHK,3BHK"
 *       - in: query
 *         name: furnishing
 *         schema:
 *           type: string
 *         description: Comma-separated furnishing types (unfurnished,semi-furnished,fully-furnished)
 *       - in: query
 *         name: tenantType
 *         schema:
 *           type: string
 *           enum: [family, bachelors, both]
 *         description: Preferred tenant type
 *       - in: query
 *         name: hasWater247
 *         schema:
 *           type: boolean
 *         description: Filter properties with 24/7 water supply
 *       - in: query
 *         name: hasPowerBackup
 *         schema:
 *           type: boolean
 *         description: Filter properties with power backup
 *       - in: query
 *         name: hasIglPipeline
 *         schema:
 *           type: boolean
 *         description: Filter properties with IGL gas pipeline
 *       - in: query
 *         name: isDirectOwner
 *         schema:
 *           type: boolean
 *         description: Filter direct owner listings (no broker)
 *       - in: query
 *         name: nearbyMetro
 *         schema:
 *           type: boolean
 *         description: Filter properties near metro stations
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyListResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  validatePagination(),
  validateCity(),
  validateRentRange(),
  validateBHK(),
  validateRequest,
  getAllProperties
);

/**
 * @swagger
 * /properties/semantic:
 *   get:
 *     summary: AI-powered semantic property search
 *     description: Search properties using natural language with RAG (Retrieval Augmented Generation). Just describe what you're looking for!
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           minLength: 3
 *         required: true
 *         description: Natural language query
 *         example: "spacious 2BHK near metro with power backup"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Semantic search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 query:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Missing or invalid search query
 *       500:
 *         description: Server error
 */
router.get(
  "/semantic",
  validateSearchQuery(),
  validateRequest,
  semanticSearchProperties
);

/**
 * @swagger
 * /properties/stats:
 *   get:
 *     summary: Get platform statistics
 *     description: Retrieve platform-wide statistics for the landing page (properties, users, agreements)
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Platform statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlatformStats'
 *       500:
 *         description: Server error
 */
router.get("/stats", getStats);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     description: Retrieve detailed information about a specific property including images, landlord details, and analytics tracking
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *         example: "cm5zj87d0000wk55xapojt75"
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Invalid property ID format
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.get("/:id", validateId("id"), validateRequest, getPropertyById);

// ==================== PROTECTED ROUTES (Require Authentication) ====================

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property listing
 *     description: Create a new property listing. Requires Landlord or Admin role.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - bhk
 *               - rent
 *               - furnishing
 *               - tenantType
 *               - addressLine1
 *               - city
 *               - state
 *               - pincode
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Modern 2BHK in Whitefield"
 *               description:
 *                 type: string
 *                 example: "Spacious apartment with modern amenities"
 *               bhk:
 *                 type: string
 *                 enum: [ONE_BHK, TWO_BHK, THREE_BHK, FOUR_BHK_PLUS]
 *               rent:
 *                 type: number
 *                 example: 25000
 *               furnishing:
 *                 type: string
 *                 enum: [UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED]
 *               tenantType:
 *                 type: string
 *                 enum: [FAMILY, BACHELORS, BOTH]
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               hasWater247:
 *                 type: boolean
 *               hasPowerBackup:
 *                 type: boolean
 *               hasIglPipeline:
 *                 type: boolean
 *               isBroker:
 *                 type: boolean
 *               brokerageFee:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error or missing required fields
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Requires Landlord or Admin role
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  requireAuth,
  requireRole(["LANDLORD", "ADMIN"]),
  ...validatePropertyData(),
  validateRequest,
  createProperty
);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update property
 *     description: Update an existing property. Requires Landlord or Admin role.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               rent:
 *                 type: number
 *               furnishing:
 *                 type: string
 *                 enum: [UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED]
 *               isActive:
 *                 type: boolean
 *               hasWater247:
 *                 type: boolean
 *               hasPowerBackup:
 *                 type: boolean
 *               hasIglPipeline:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Invalid property ID or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your property or insufficient role
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  requireAuth,
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateId("id"),
  validateRequest,
  updateProperty
);

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete property
 *     description: Delete a property listing. Requires Landlord or Admin role.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your property or insufficient role
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  requireAuth,
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateId("id"),
  validateRequest,
  deleteProperty
);

/**
 * @swagger
 * /properties/{id}/toggle:
 *   patch:
 *     summary: Toggle property availability
 *     description: Activate or deactivate a property listing. Requires Landlord or Admin role.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your property
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id/toggle",
  requireAuth,
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateId("id"),
  validateRequest,
  togglePropertyAvailability
);

/**
 * @swagger
 * /properties/{id}/analytics:
 *   get:
 *     summary: Get property analytics
 *     description: Get view counts, leads, and visit data for a property. Requires Landlord or Admin role.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   $ref: '#/components/schemas/PropertyAnalytics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your property
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id/analytics",
  requireAuth,
  requireRole(["LANDLORD", "ADMIN"]),
  ...validateId("id"),
  validateRequest,
  getPropertyAnalytics
);

export default router;
