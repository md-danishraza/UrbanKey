import { body, query, param } from "express-validator";
import { validatePagination } from "./common.validations.js";

// ==================== VERIFICATION VALIDATIONS ====================

/**
 * Document rejection validation
 */
export const validateRejectDocument = () => [
  param("documentId")
    .notEmpty()
    .withMessage("Document ID is required")
    .isString()
    .withMessage("Document ID must be a string"),

  body("reason")
    .optional()
    .isString()
    .withMessage("Rejection reason must be a string")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Rejection reason must be between 5 and 500 characters"),
];

/**
 * Document approval validation
 */
export const validateApproveDocument = () => [
  param("documentId")
    .notEmpty()
    .withMessage("Document ID is required")
    .isString()
    .withMessage("Document ID must be a string"),
];

/**
 * Verification filters validation
 */
export const validateVerificationFilters = () => [
  query("status")
    .optional()
    .isIn(["PENDING", "APPROVED", "REJECTED", "ALL"])
    .withMessage("Invalid status filter"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];

// ==================== USER MANAGEMENT VALIDATIONS ====================

/**
 * User role update validation
 */
export const validateUpdateUserRole = () => [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .matches(/^user_[a-zA-Z0-9]+$/)
    .withMessage("User ID must be a valid Clerk user ID"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["TENANT", "LANDLORD", "ADMIN"])
    .withMessage("Role must be TENANT, LANDLORD, or ADMIN"),
];

/**
 * User verification validation
 */
export const validateVerifyUser = () => [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .matches(/^user_[a-zA-Z0-9]+$/)
    .withMessage("User ID must be a valid Clerk user ID"),
];

/**
 * User deletion validation
 */
export const validateDeleteUser = () => [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .matches(/^user_[a-zA-Z0-9]+$/)
    .withMessage("User ID must be a valid Clerk user ID"),
];

/**
 * User filters validation
 */
export const validateUserFilters = () => [
  query("role")
    .optional()
    .isIn(["TENANT", "LANDLORD", "ADMIN", "ALL"])
    .withMessage("Invalid role filter"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .trim(),

  ...validatePagination(),
];

// ==================== PROPERTY MANAGEMENT VALIDATIONS ====================

/**
 * Property status update validation
 */
export const validateUpdatePropertyStatus = () => [
  param("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),

  body("isActive")
    .notEmpty()
    .withMessage("isActive is required")
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .toBoolean(),
];

/**
 * Property deletion validation
 */
export const validateDeleteProperty = () => [
  param("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),
];

/**
 * Property filters validation
 */
export const validatePropertyFilters = () => [
  query("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "PENDING", "ALL"])
    .withMessage("Invalid status filter"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .trim(),

  ...validatePagination(),
];

// ==================== AI ANALYTICS VALIDATIONS ====================

/**
 * AI query validation
 */
export const validateAIQuery = () => [
  body("query")
    .notEmpty()
    .withMessage("Query is required")
    .isString()
    .withMessage("Query must be a string")
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Query must be between 3 and 500 characters"),

  body("type")
    .optional()
    .isIn(["general", "properties", "users", "market"])
    .withMessage("Invalid analysis type"),
];
