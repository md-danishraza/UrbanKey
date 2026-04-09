import { Router } from "express";
import { clerkWebhook } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication and user sync endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WebhookEvent:
 *       type: object
 *       description: Clerk webhook event structure
 *       properties:
 *         type:
 *           type: string
 *           enum: [user.created, user.updated, user.deleted]
 *           example: "user.created"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "user_2abc123def456"
 *             email_addresses:
 *               type: array
 *               items:
 *                 type: object
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             image_url:
 *               type: string
 *
 *     WebhookResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Clerk JWT token for API authentication
 */

/**
 * @swagger
 * /auth/webhook:
 *   post:
 *     summary: Clerk Webhook Endpoint
 *     description: |
 *       Receives webhook events from Clerk for user lifecycle management.
 *
 *       **Events handled:**
 *       - `user.created` - Creates user in database
 *       - `user.updated` - Updates user information
 *       - `user.deleted` - Removes user from database
 *
 *       **Security:** Webhook signature is verified using Svix to ensure requests are from Clerk.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookEvent'
 *           example:
 *             type: "user.created"
 *             data:
 *               id: "user_2abc123def456"
 *               email_addresses:
 *                 - id: "idn_xxx"
 *                   email_address: "user@example.com"
 *               first_name: "John"
 *               last_name: "Doe"
 *               image_url: "https://img.clerk.com/xxx"
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebhookResponse'
 *             example:
 *               success: true
 *               message: "Webhook processed successfully"
 *       400:
 *         description: Invalid signature or malformed request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid signature"
 *               message: "Webhook signature verification failed"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/webhook", clerkWebhook);

export default router;
