import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  validateChatQuestion,
  validateChatHistoryQuery,
} from "../validations/chat.validations.js";
import {
  askChatQuestion,
  getChatHistory,
  clearChatHistory,
} from "../controllers/chat.controller.js";
import rateLimit from "express-rate-limit";

// Rate limiting for chat API (10 requests per minute)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: "Too many requests, please slow down" },
  skip: (req) => process.env.NODE_ENV === "development", // Skip in development
});

const router = Router();

// All chat routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: AI-powered chat assistant using RAG (Retrieval Augmented Generation)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatQuestion:
 *       type: object
 *       required:
 *         - question
 *       properties:
 *         question:
 *           type: string
 *           minLength: 3
 *           maxLength: 500
 *           example: "What properties are available near metro stations?"
 *
 *     ChatResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         answer:
 *           type: string
 *           description: AI-generated response based on property data
 *         properties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Property'
 *           description: Relevant properties found
 *         suggestedQuestions:
 *           type: array
 *           items:
 *             type: string
 *
 *     ChatHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         relevantPropertyIds:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// ==================== CHAT ENDPOINTS ====================

/**
 * @swagger
 * /chat/ask:
 *   post:
 *     summary: Ask a question to the AI assistant
 *     description: |
 *       Send a natural language question to the AI-powered chatbot.
 *       The assistant uses RAG (Retrieval Augmented Generation) to answer questions
 *       based on your property database.
 *
 *       **Rate Limit:** 10 requests per minute
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatQuestion'
 *           example:
 *             question: "Show me 2BHK apartments with power backup near metro"
 *     responses:
 *       200:
 *         description: AI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             example:
 *               success: true
 *               answer: "I found 3 properties matching your criteria. Here are the details..."
 *               properties:
 *                 - id: "prop_123"
 *                   title: "Modern 2BHK in Whitefield"
 *                   rent: 25000
 *               suggestedQuestions:
 *                 - "Tell me more about Modern 2BHK in Whitefield"
 *                 - "Show properties under ₹30,000"
 *       400:
 *         description: Invalid question (too short, too long, or missing)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post(
  "/ask",
  chatLimiter,
  ...validateChatQuestion(),
  validateRequest,
  askChatQuestion
);

/**
 * @swagger
 * /chat/history:
 *   get:
 *     summary: Get user's chat history
 *     description: Returns the authenticated user's previous chat conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of history records to return
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatHistory'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/history",
  ...validateChatHistoryQuery(),
  validateRequest,
  getChatHistory
);

/**
 * @swagger
 * /chat/history:
 *   delete:
 *     summary: Clear user's chat history
 *     description: Permanently deletes all chat history for the authenticated user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Chat history cleared"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/history", clearChatHistory);

export default router;
