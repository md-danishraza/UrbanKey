import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
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

router.post("/ask", chatLimiter, askChatQuestion);
router.get("/history", getChatHistory);
router.delete("/history", clearChatHistory);

export default router;
