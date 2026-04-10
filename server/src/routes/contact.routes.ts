import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateRequest } from "../middleware/validation.middleware.js";
import { validateContactForm } from "../validations/chat.validations.js";
import { sendContactEmail } from "../controllers/email.controller.js";

// Rate limiting for contact form (5 requests per hour)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: {
    success: false,
    message: "Too many messages. Please try again later.",
  },
  skip: (req) => process.env.NODE_ENV === "development",
});

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form and support endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactForm:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         subject:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: "Question about property listing"
 *         message:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           example: "I have a question about the property verification process..."
 *         phone:
 *           type: string
 *           pattern: "^[6-9]\\d{9}$"
 *           example: "9876543210"
 *           description: Optional 10-digit Indian phone number
 *
 *     ContactResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *
 *     ContactErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact form
 *     description: |
 *       Send a message to UrbanKey support team.
 *
 *       **Rate Limit:** 5 requests per hour per IP
 *
 *       **What happens:**
 *       1. Your message is validated
 *       2. An email is sent to the support team
 *       3. You receive an auto-reply confirmation
 *       4. Support will respond within 24-48 hours
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactForm'
 *           example:
 *             name: "Rahul Sharma"
 *             email: "rahul@example.com"
 *             subject: "Need help with property verification"
 *             message: "I uploaded my Aadhar card but it's still pending. How long does verification take?"
 *             phone: "9876543210"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *             example:
 *               success: true
 *               message: "Email sent successfully! We'll get back to you soon."
 *       400:
 *         description: Validation error - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactErrorResponse'
 *             example:
 *               success: false
 *               errors:
 *                 - msg: "Valid email address is required"
 *                   param: "email"
 *                   location: "body"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Too many messages. Please try again later."
 *       500:
 *         description: Server error - Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *             example:
 *               success: false
 *               message: "Failed to send email. Please try again later."
 */
router.post(
  "/contact",
  contactLimiter,
  ...validateContactForm(),
  validateRequest,
  sendContactEmail
);

export default router;
