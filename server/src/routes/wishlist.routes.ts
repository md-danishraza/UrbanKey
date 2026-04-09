import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { validateWishlistProperty } from "../validations/interaction.validations.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
  getWishlistCount,
} from "../controllers/wishlist.controller.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Tenant wishlist management (saved properties)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         propertyId:
 *           type: string
 *         property:
 *           $ref: '#/components/schemas/Property'
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     WishlistStatus:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         isInWishlist:
 *           type: boolean
 *         wishlistId:
 *           type: string
 */

// ==================== WISHLIST CRUD ====================

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     description: Returns all saved properties in the authenticated tenant's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WishlistItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", getWishlist);

/**
 * @swagger
 * /wishlist/count:
 *   get:
 *     summary: Get wishlist count
 *     description: Returns the number of properties in the authenticated tenant's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count retrieved successfully
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
 *       500:
 *         description: Server error
 */
router.get("/count", getWishlistCount);

/**
 * @swagger
 * /wishlist/{propertyId}/status:
 *   get:
 *     summary: Check if property is in wishlist
 *     description: Checks whether a specific property is saved in the user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID to check
 *     responses:
 *       200:
 *         description: Status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistStatus'
 *       400:
 *         description: Invalid property ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/:propertyId/status",
  ...validateWishlistProperty(),
  validateRequest,
  checkWishlistStatus
);

/**
 * @swagger
 * /wishlist/{propertyId}:
 *   post:
 *     summary: Add property to wishlist
 *     description: Adds a property to the authenticated tenant's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID to add
 *     responses:
 *       200:
 *         description: Property added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wishlist:
 *                   $ref: '#/components/schemas/WishlistItem'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid property ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:propertyId",
  ...validateWishlistProperty(),
  validateRequest,
  addToWishlist
);

/**
 * @swagger
 * /wishlist/{propertyId}:
 *   delete:
 *     summary: Remove property from wishlist
 *     description: Removes a property from the authenticated tenant's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID to remove
 *     responses:
 *       200:
 *         description: Property removed from wishlist
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
 *         description: Invalid property ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in wishlist
 *       500:
 *         description: Server error
 */
router.delete(
  "/:propertyId",
  ...validateWishlistProperty(),
  validateRequest,
  removeFromWishlist
);

export default router;
