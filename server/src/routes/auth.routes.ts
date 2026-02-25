// # Clerk webhook routes
import { Router } from "express";
import { clerkWebhook } from "../controllers/auth.controller.js";

const router = Router();

// Clerk webhook endpoint (raw body needed for verification)
router.post("/webhook", clerkWebhook);

export default router;
