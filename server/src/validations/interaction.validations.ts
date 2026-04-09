import { body, query, param } from "express-validator";
import { validatePagination } from "./common.validations.js";

// ==================== LEAD VALIDATIONS ====================

/**
 * Lead creation validation
 */
export const validateCreateLead = () => [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string")
    .isLength({ min: 10, max: 50 })
    .withMessage("Property ID must be between 10 and 50 characters"),

  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Message must be between 10 and 500 characters")
    .escape(),

  body("contactMethod")
    .optional()
    .isIn(["WHATSAPP", "PHONE", "EMAIL"])
    .withMessage("Contact method must be WHATSAPP, PHONE, or EMAIL"),
];

/**
 * Lead status update validation
 */
export const validateUpdateLeadStatus = () => [
  param("leadId")
    .notEmpty()
    .withMessage("Lead ID is required")
    .isString()
    .withMessage("Lead ID must be a string"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["NEW", "CONTACTED", "CONVERTED", "CLOSED"])
    .withMessage("Status must be NEW, CONTACTED, CONVERTED, or CLOSED"),
];

/**
 * Lead query filters validation
 */
export const validateLeadFilters = () => [
  query("status")
    .optional()
    .isIn(["NEW", "CONTACTED", "CONVERTED", "CLOSED", "ALL"])
    .withMessage("Invalid status filter"),

  query("propertyId")
    .optional()
    .isString()
    .withMessage("Property ID must be a string"),

  ...validatePagination(),
];

// ==================== VISIT VALIDATIONS ====================

/**
 * Visit creation validation
 */
export const validateCreateVisit = () => [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),

  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date")
    .toDate()
    .custom((date) => {
      if (date < new Date()) {
        throw new Error("Scheduled date cannot be in the past");
      }
      return true;
    }),

  body("scheduledTime")
    .notEmpty()
    .withMessage("Scheduled time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:MM format (24-hour)"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters")
    .escape(),
];

/**
 * Visit status update validation
 */
export const validateUpdateVisitStatus = () => [
  param("visitId")
    .notEmpty()
    .withMessage("Visit ID is required")
    .isString()
    .withMessage("Visit ID must be a string"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
    .withMessage("Status must be PENDING, CONFIRMED, CANCELLED, or COMPLETED"),
];

/**
 * Visit query filters validation
 */
export const validateVisitFilters = () => [
  query("status")
    .optional()
    .isIn(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "ALL"])
    .withMessage("Invalid status filter"),

  query("propertyId")
    .optional()
    .isString()
    .withMessage("Property ID must be a string"),
];

// ==================== WISHLIST VALIDATIONS ====================

/**
 * Wishlist property ID validation
 */
export const validateWishlistProperty = () => [
  param("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string")
    .isLength({ min: 10, max: 50 })
    .withMessage("Property ID must be between 10 and 50 characters"),
];
