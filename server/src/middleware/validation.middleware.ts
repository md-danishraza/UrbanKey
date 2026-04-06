// # Request validation
import type { Request, Response, NextFunction } from "express";
import { validationResult, type ValidationError } from "express-validator";

// Format validation errors into a readable structure
const formatValidationErrors = (errors: ValidationError[]) => {
  const formatted: Record<string, string[]> = {};

  errors.forEach((error) => {
    if (error.type === "field") {
      const field = error.path;
      const message = error.msg;

      if (!formatted[field]) {
        formatted[field] = [];
      }
      formatted[field].push(message);
    }
  });

  return formatted;
};

// Middleware to check validation results
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());

    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: formattedErrors,
    });
  }

  next();
};

// Common validation helpers
export const validators = {
  // ID validation (UUID or cuid format)
  id: (field: string = "id") => ({
    in: ["params"],
    isString: true,
    notEmpty: true,
    errorMessage: `${field} must be a valid ID`,
  }),

  // Pagination validation
  pagination: () => [
    {
      in: ["query"],
      field: "page",
      optional: true,
      isInt: { min: 1 },
      toInt: true,
      errorMessage: "Page must be a positive integer",
    },
    {
      in: ["query"],
      field: "limit",
      optional: true,
      isInt: { min: 1, max: 10 },
      toInt: true,
      errorMessage: "Limit must be between 1 and 10",
    },
  ],

  // Email validation
  email: (field: string = "email") => ({
    in: ["body"],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "Valid email address is required",
  }),

  // Phone validation (Indian format)
  phone: (field: string = "phone", required: boolean = false) => ({
    in: ["body"],
    optional: required ? false : true,
    matches: {
      options: /^[6-9]\d{9}$/,
      errorMessage: "Phone number must be a valid 10-digit Indian number",
    },
  }),

  // Rent validation
  rent: (field: string = "rent") => ({
    in: ["body"],
    isFloat: { min: 0, max: 1000000 },
    toFloat: true,
    errorMessage: "Rent must be between 0 and 10,00,000",
  }),

  // BHK validation
  bhk: () => ({
    in: ["body", "query"],
    optional: true,
    isIn: {
      options: [
        [
          "ONE_BHK",
          "TWO_BHK",
          "THREE_BHK",
          "FOUR_BHK_PLUS",
          "1BHK",
          "2BHK",
          "3BHK",
          "4BHK+",
        ],
      ],
      errorMessage: "Invalid BHK type",
    },
  }),

  // Status validation for leads/visits
  status: (validStatuses: string[]) => ({
    in: ["body"],
    optional: true,
    isIn: {
      options: [validStatuses],
      errorMessage: `Status must be one of: ${validStatuses.join(", ")}`,
    },
  }),
};
