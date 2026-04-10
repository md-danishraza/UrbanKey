import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateRejectDocument,
  validateApproveDocument,
  validateVerificationFilters,
  validateUpdateUserRole,
  validateVerifyUser,
  validateDeleteUser,
  validateUserFilters,
  validateUpdatePropertyStatus,
  validateDeleteProperty,
  validatePropertyFilters,
  validateAIQuery,
} from "../validations/admin.validations.js";
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

// All admin routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireRole(["ADMIN"]));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDocument:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         documentType:
 *           type: string
 *           enum: [aadhar, pan, property]
 *         fileUrl:
 *           type: string
 *         fileName:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         rejectionReason:
 *           type: string
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     AdminUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [TENANT, LANDLORD, ADMIN]
 *         isVerified:
 *           type: boolean
 *         avatarUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     AdminProperty:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Property'
 *         - type: object
 *           properties:
 *             views:
 *               type: integer
 *             leads:
 *               type: integer
 *
 *     VerificationStats:
 *       type: object
 *       properties:
 *         pending:
 *           type: integer
 *         approved:
 *           type: integer
 *         rejected:
 *           type: integer
 *         total:
 *           type: integer
 *         daily:
 *           type: array
 *
 *     PlatformStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *         totalLandlords:
 *           type: integer
 *         totalTenants:
 *           type: integer
 *         totalProperties:
 *           type: integer
 *         activeProperties:
 *           type: integer
 *         monthlyActiveUsers:
 *           type: integer
 *
 *     AIAnalysisRequest:
 *       type: object
 *       required:
 *         - query
 *       properties:
 *         query:
 *           type: string
 *         type:
 *           type: string
 *           enum: [general, properties, users, market]
 *
 *     AIAnalysisResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         answer:
 *           type: string
 *         insights:
 *           type: object
 *           properties:
 *             trends:
 *               type: array
 *               items:
 *                 type: string
 *             recommendations:
 *               type: array
 *               items:
 *                 type: string
 */

// ==================== VERIFICATION ROUTES ====================

/**
 * @swagger
 * /admin/verifications/pending:
 *   get:
 *     summary: Get all pending verifications
 *     description: Returns all user documents pending admin verification
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending verifications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDocument'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get("/verifications/pending", getPendingVerifications);

/**
 * @swagger
 * /admin/verifications/all:
 *   get:
 *     summary: Get all verifications with filters
 *     description: Returns all user documents with optional status filtering
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, ALL]
 *         description: Filter by document status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Verifications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDocument'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  "/verifications/all",
  ...validateVerificationFilters(),
  validateRequest,
  getAllVerifications
);

/**
 * @swagger
 * /admin/verifications/stats:
 *   get:
 *     summary: Get verification statistics
 *     description: Returns counts of pending, approved, and rejected documents
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationStats'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/verifications/stats", getVerificationStats);

/**
 * @swagger
 * /admin/verifications/{documentId}:
 *   get:
 *     summary: Get document by ID
 *     description: Returns detailed information about a specific document
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Document retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get("/verifications/:documentId", getDocumentById);

/**
 * @swagger
 * /admin/verifications/{documentId}/approve:
 *   post:
 *     summary: Approve a document
 *     description: Approves a user verification document
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Document approved successfully
 *       400:
 *         description: Invalid document ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.post(
  "/verifications/:documentId/approve",
  ...validateApproveDocument(),
  validateRequest,
  approveDocument
);

/**
 * @swagger
 * /admin/verifications/{documentId}/reject:
 *   post:
 *     summary: Reject a document
 *     description: Rejects a user verification document with a reason
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Image is blurry, please upload a clear image"
 *     responses:
 *       200:
 *         description: Document rejected successfully
 *       400:
 *         description: Invalid document ID or reason
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.post(
  "/verifications/:documentId/reject",
  ...validateRejectDocument(),
  validateRequest,
  rejectDocument
);

// ==================== DASHBOARD STATS ROUTES ====================

/**
 * @swagger
 * /admin/dashboard/users/stats:
 *   get:
 *     summary: Get user statistics for dashboard
 *     description: Returns counts of total users, landlords, and tenants
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalUsers:
 *                   type: integer
 *                 totalLandlords:
 *                   type: integer
 *                 totalTenants:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/dashboard/users/stats", getUserStats);

/**
 * @swagger
 * /admin/dashboard/properties/stats:
 *   get:
 *     summary: Get property statistics for dashboard
 *     description: Returns counts of total and active properties
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalProperties:
 *                   type: integer
 *                 activeProperties:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/dashboard/properties/stats", getPropertyStats);

/**
 * @swagger
 * /admin/analytics/monthly-active:
 *   get:
 *     summary: Get monthly active users count
 *     description: Returns number of active users in the last 30 days
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/analytics/monthly-active", getMonthlyActiveUsers);

// ==================== PROPERTY MANAGEMENT ROUTES ====================

/**
 * @swagger
 * /admin/properties:
 *   get:
 *     summary: Get all properties (admin view)
 *     description: Returns all properties with filters and analytics data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, ALL]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, description, city, or landlord name
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
 *         description: Properties retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminProperty'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  "/properties",
  ...validatePropertyFilters(),
  validateRequest,
  getAdminProperties
);

/**
 * @swagger
 * /admin/properties/stats:
 *   get:
 *     summary: Get property statistics for admin
 *     description: Returns detailed property statistics including views and leads
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalProperties:
 *                   type: integer
 *                 activeProperties:
 *                   type: integer
 *                 inactiveProperties:
 *                   type: integer
 *                 totalViews:
 *                   type: integer
 *                 totalLeads:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/properties/stats", getAdminPropertyStats);

/**
 * @swagger
 * /admin/properties/{propertyId}/status:
 *   patch:
 *     summary: Update property status
 *     description: Activate or deactivate a property
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Property status updated
 *       400:
 *         description: Invalid property ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/properties/:propertyId/status",
  ...validateUpdatePropertyStatus(),
  validateRequest,
  updatePropertyStatus
);

/**
 * @swagger
 * /admin/properties/{propertyId}:
 *   delete:
 *     summary: Delete a property (admin only)
 *     description: Permanently deletes a property and all associated data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       400:
 *         description: Invalid property ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/properties/:propertyId",
  ...validateDeleteProperty(),
  validateRequest,
  deletePropertyAdmin
);

// ==================== USER MANAGEMENT ROUTES ====================

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin view)
 *     description: Returns all users with role and status filters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [TENANT, LANDLORD, ADMIN, ALL]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
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
 *         description: Users retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminUser'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/users", ...validateUserFilters(), validateRequest, getAdminUsers);

/**
 * @swagger
 * /admin/users/stats:
 *   get:
 *     summary: Get user statistics for admin
 *     description: Returns detailed user statistics including verification status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalUsers:
 *                   type: integer
 *                 verified:
 *                   type: integer
 *                 unverified:
 *                   type: integer
 *                 tenants:
 *                   type: integer
 *                 landlords:
 *                   type: integer
 *                 admins:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/users/stats", getAdminUserStats);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   patch:
 *     summary: Update user role
 *     description: Changes a user's role (TENANT, LANDLORD, ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [TENANT, LANDLORD, ADMIN]
 *     responses:
 *       200:
 *         description: User role updated
 *       400:
 *         description: Invalid user ID or role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/users/:userId/role",
  ...validateUpdateUserRole(),
  validateRequest,
  updateUserRole
);

/**
 * @swagger
 * /admin/users/{userId}/verify:
 *   patch:
 *     summary: Verify a user
 *     description: Marks a user as verified (KYC completed)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/users/:userId/verify",
  ...validateVerifyUser(),
  validateRequest,
  verifyUser
);

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     description: Permanently deletes a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID or cannot delete self
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/users/:userId",
  ...validateDeleteUser(),
  validateRequest,
  deleteUser
);

// ==================== AI ANALYTICS ROUTES ====================

/**
 * @swagger
 * /admin/ai/analyze:
 *   post:
 *     summary: Get AI-powered analytics
 *     description: Returns AI-generated insights about platform data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIAnalysisRequest'
 *     responses:
 *       200:
 *         description: AI analysis completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIAnalysisResponse'
 *       400:
 *         description: Invalid query
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  "/ai/analyze",
  ...validateAIQuery(),
  validateRequest,
  getAIAnalytics
);

/**
 * @swagger
 * /admin/ai/quick-stats:
 *   get:
 *     summary: Get quick platform statistics
 *     description: Returns quick stats for AI analytics dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quick stats retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mostSearchedArea:
 *                   type: string
 *                 averageRent2BHK:
 *                   type: number
 *                 highestDemand:
 *                   type: string
 *                 responseRate:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/ai/quick-stats", getQuickStats);

export default router;
