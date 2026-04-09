import { body, param } from "express-validator";

/**
 * User ID validation for params
 */
export const validateUserParam = () => [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .matches(/^user_[a-zA-Z0-9]+$/)
    .withMessage('User ID must be a valid Clerk user ID (starts with "user_")'),
];

/**
 * User profile update validation
 */
export const validateUserProfileUpdate = () => [
  body("fullName")
    .optional()
    .isString()
    .withMessage("Full name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Phone number must be a valid 10-digit Indian number (starts with 6-9)"
    )
    .trim(),

  body("avatarUrl")
    .optional()
    .isURL()
    .withMessage("Avatar URL must be a valid URL")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email address is required")
    .normalizeEmail(),
];

/**
 * User sync validation
 */
export const validateUserSync = () => [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email address is required")
    .normalizeEmail(),

  body("fullName")
    .optional()
    .isString()
    .withMessage("Full name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("role")
    .optional()
    .isIn(["TENANT", "LANDLORD", "ADMIN"])
    .withMessage("Role must be TENANT, LANDLORD, or ADMIN"),

  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian number"),
];
