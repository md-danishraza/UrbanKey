import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateUserProfileUpdate,
  validateUserSync,
  validateUserParam,
} from "../validations/user.validations.js";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  syncUser,
  getLandlordProperties,
  isLandlordVerified,
  getUserDocuments,
  getUserAgreements,
} from "../controllers/user.controller.js";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "user_2abc123def456"
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         phone:
 *           type: string
 *           example: "+919876543210"
 *         fullName:
 *           type: string
 *           example: "John Doe"
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
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Updated Doe"
 *         phone:
 *           type: string
 *           example: "+919876543211"
 *         avatarUrl:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 *
 *     UserSyncRequest:
 *       type: object
 *       required:
 *         - email
 *         - fullName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [TENANT, LANDLORD, ADMIN]
 *         phone:
 *           type: string
 *         avatarUrl:
 *           type: string
 */

// ==================== CURRENT USER ROUTES ====================

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's complete profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", getCurrentUser);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     description: Updates the authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/me", ...validateUserProfileUpdate(), validateRequest, updateUser);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user account
 *     description: Permanently deletes the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete account with active agreements
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/me", deleteUser);

/**
 * @swagger
 * /users/sync:
 *   post:
 *     summary: Sync user with Clerk
 *     description: Syncs the authenticated user's data with Clerk and updates the database
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSyncRequest'
 *     responses:
 *       200:
 *         description: User synced successfully
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/sync", ...validateUserSync(), validateRequest, syncUser);

// ==================== LANDLORD SPECIFIC ROUTES ====================

/**
 * @swagger
 * /users/landlord/me:
 *   get:
 *     summary: Get landlord's properties with analytics
 *     description: Returns all properties owned by the authenticated landlord with view and lead counts
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
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
 *                     $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not a landlord
 *       500:
 *         description: Server error
 */
router.get("/landlord/me", getLandlordProperties);

/**
 * @swagger
 * /users/landlord/isVerified:
 *   get:
 *     summary: Check if landlord is verified
 *     description: Returns the verification status of the authenticated landlord
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isVerified:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not a landlord
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/landlord/isVerified", isLandlordVerified);

// ==================== USER SPECIFIC ROUTES (Admin/Self) ====================

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns user profile for the specified ID (requires admin or self)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID (Clerk format)
 *         example: "user_2abc123def456"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:userId", ...validateUserParam(), validateRequest, getUserById);

// ==================== PROFILE MANAGEMENT ROUTES (Future Implementation) ====================

/**
 * @swagger
 * /users/me/documents:
 *   get:
 *     summary: Get user's uploaded documents
 *     description: Returns all documents uploaded by the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me/documents", getUserDocuments);

/**
 * @swagger
 * /users/me/agreements:
 *   get:
 *     summary: Get user's rental agreements
 *     description: Returns all rental agreements for the authenticated user (both as tenant and landlord)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agreements retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me/agreements", getUserAgreements);

export default router;
