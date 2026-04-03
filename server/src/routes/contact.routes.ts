import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
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

router.post(
  "/contact",
  contactLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email address is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters long"),
    body("phone")
      .optional()
      .isMobilePhone("any")
      .withMessage("Valid phone number is required"),
  ],
  sendContactEmail
);

export default router;
