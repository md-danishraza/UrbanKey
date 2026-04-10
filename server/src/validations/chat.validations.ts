import { body, query } from "express-validator";

// ==================== CHAT VALIDATIONS ====================

/**
 * Chat question validation
 */
export const validateChatQuestion = () => [
  body("question")
    .notEmpty()
    .withMessage("Question is required")
    .isString()
    .withMessage("Question must be a string")
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Question must be between 3 and 500 characters")
    .escape(),
];

/**
 * Chat history query validation
 */
export const validateChatHistoryQuery = () => [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
    .toInt(),
];

// ==================== CONTACT VALIDATIONS ====================

/**
 * Contact form validation
 */
export const validateContactForm = () => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required")
    .normalizeEmail(),

  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isString()
    .withMessage("Subject must be a string")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Subject must be between 3 and 200 characters")
    .escape(),

  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters")
    .escape(),

  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian number")
    .trim(),
];
