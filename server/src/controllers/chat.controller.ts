import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { askQuestion, getUserChatHistory } from "../services/rag.service.js";
import prisma from "../config/database.js";

// Ask a question to the AI chatbot
export const askChatQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    // Trim and validate question length
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 3) {
      return res
        .status(400)
        .json({ error: "Question must be at least 3 characters" });
    }
    if (trimmedQuestion.length > 500) {
      return res
        .status(400)
        .json({ error: "Question is too long (max 500 characters)" });
    }

    const result = await askQuestion(trimmedQuestion, userId);

    res.json({
      success: true,
      answer: result.answer,
      properties: result.properties,
      suggestedQuestions: result.suggestedQuestions,
    });
  } catch (error) {
    console.error("Error in chat ask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's chat history
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const history = await getUserChatHistory(userId, limit);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Clear chat history
export const clearChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.chatHistory.deleteMany({
      where: { userId },
    });

    res.json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
