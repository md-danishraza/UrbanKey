import { body, query, param, type ValidationChain } from "express-validator";

// ==================== PARAMETER VALIDATIONS ====================

/**
 * Validates MongoDB/CUID ID format
 * Used for: /api/users/:id, /api/properties/:id, etc.
 */
export const validateId = (paramName: string = "id"): ValidationChain[] => [
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .isString()
    .withMessage(`${paramName} must be a string`)
    .isLength({ min: 1, max: 50 })
    .withMessage(`${paramName} must be between 1 and 50 characters`),
];

/**
 * Validates UUID format (Clerk user IDs)
 */
export const validateUserId = (
  paramName: string = "userId"
): ValidationChain[] => [
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .matches(/^user_[a-zA-Z0-9]+$/)
    .withMessage(
      `${paramName} must be a valid Clerk user ID (starts with 'user_')`
    ),
];

// ==================== QUERY PARAMETER VALIDATIONS ====================

/**
 * Validates pagination parameters (page, limit)
 * Used for: listing endpoints
 */
export const validatePagination = (): ValidationChain[] => [
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

/**
 * Validates search query parameter
 */
export const validateSearchQuery = (): ValidationChain[] => [
  query("q")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Search query must be between 1 and 200 characters")
    .escape(),
];

/**
 * Validates city filter parameter
 */
export const validateCity = (): ValidationChain[] => [
  query("city")
    .optional()
    .isString()
    .withMessage("City must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("City name must be between 2 and 100 characters")
    .escape(),
];

/**
 * Validates rent range parameters
 */
export const validateRentRange = (): ValidationChain[] => [
  query("minRent")
    .optional()
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("minRent must be a number between 0 and 10,000,000")
    .toFloat(),
  query("maxRent")
    .optional()
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("maxRent must be a number between 0 and 10,000,000")
    .toFloat()
    .custom((maxRent, { req }) => {
      const minRent = req.query?.minRent;
      if (minRent && maxRent < Number(minRent)) {
        throw new Error("maxRent must be greater than or equal to minRent");
      }
      return true;
    }),
];

/**
 * Validates BHK filter (can be single or multiple)
 */
export const validateBHK = (): ValidationChain[] => [
  query("bhk")
    .optional()
    .custom((value) => {
      const validBHKs = ["1BHK", "2BHK", "3BHK", "4BHK+"];
      const bhkArray = Array.isArray(value) ? value : [value];

      for (const bhk of bhkArray) {
        if (!validBHKs.includes(bhk)) {
          throw new Error(
            `Invalid BHK type: ${bhk}. Valid types: ${validBHKs.join(", ")}`
          );
        }
      }
      return true;
    }),
];

// ==================== BODY VALIDATIONS ====================

/**
 * Validates email field
 */
export const validateEmail = (
  field: string = "email",
  required: boolean = true
): ValidationChain[] => {
  const chain = [
    body(field)
      .if(body(field).exists())
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail()
      .trim(),
  ];

  if (required) {
    return [body(field).notEmpty().withMessage("Email is required"), ...chain];
  }
  return chain;
};

/**
 * Validates phone number (Indian format)
 */
export const validatePhone = (
  field: string = "phone",
  required: boolean = false
): ValidationChain[] => {
  const chain = [
    body(field)
      .optional({ checkFalsy: true })
      .matches(/^[6-9]\d{9}$/)
      .withMessage(
        "Phone number must be a valid 10-digit Indian number (starts with 6-9)"
      )
      .trim(),
  ];

  if (required) {
    return [
      body(field).notEmpty().withMessage("Phone number is required"),
      ...chain,
    ];
  }
  return chain;
};

/**
 * Validates name field
 */
export const validateName = (
  field: string = "fullName",
  required: boolean = true
): ValidationChain[] => {
  const chain = [
    body(field)
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),
  ];

  if (required) {
    return [body(field).notEmpty().withMessage("Name is required"), ...chain];
  }
  return chain;
};

/**
 * Validates address fields
 */
export const validateAddress = (): ValidationChain[] => [
  body("addressLine1")
    .optional()
    .isString()
    .withMessage("Address line 1 must be a string")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters")
    .escape(),
  body("addressLine2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address line 2 cannot exceed 200 characters")
    .escape(),
  body("city")
    .optional()
    .isString()
    .withMessage("City must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("City name must be between 2 and 100 characters")
    .escape(),
  body("state")
    .optional()
    .isString()
    .withMessage("State must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("State name must be between 2 and 100 characters")
    .escape(),
  body("pincode")
    .optional()
    .matches(/^\d{6}$/)
    .withMessage("Pincode must be a 6-digit number"),
];

/**
 * Validates property features (amenities)
 */
export const validateAmenities = (): ValidationChain[] => [
  body("hasWater247")
    .optional()
    .isBoolean()
    .withMessage("hasWater247 must be a boolean")
    .toBoolean(),
  body("hasPowerBackup")
    .optional()
    .isBoolean()
    .withMessage("hasPowerBackup must be a boolean")
    .toBoolean(),
  body("hasIglPipeline")
    .optional()
    .isBoolean()
    .withMessage("hasIglPipeline must be a boolean")
    .toBoolean(),
  body("parkingAvailable")
    .optional()
    .isBoolean()
    .withMessage("parkingAvailable must be a boolean")
    .toBoolean(),
  body("petFriendly")
    .optional()
    .isBoolean()
    .withMessage("petFriendly must be a boolean")
    .toBoolean(),
];

/**
 * Validates message field (for leads, contact, chat)
 */
export const validateMessage = (
  field: string = "message",
  required: boolean = true,
  minLength: number = 10
): ValidationChain[] => {
  const chain = [
    body(field)
      .isString()
      .withMessage("Message must be a string")
      .trim()
      .isLength({ min: minLength, max: 5000 })
      .withMessage(`Message must be between ${minLength} and 5000 characters`)
      .escape(),
  ];

  if (required) {
    return [
      body(field).notEmpty().withMessage("Message is required"),
      ...chain,
    ];
  }
  return chain;
};

/**
 * Validates date fields
 */
export const validateDate = (
  field: string,
  required: boolean = true
): ValidationChain[] => {
  const chain = [
    body(field)
      .isISO8601()
      .withMessage(`${field} must be a valid ISO 8601 date`)
      .toDate(),
  ];

  if (required) {
    return [
      body(field).notEmpty().withMessage(`${field} is required`),
      ...chain,
    ];
  }
  return chain;
};

/**
 * Validates date range (startDate < endDate)
 */
export const validateDateRange = (
  startField: string = "startDate",
  endField: string = "endDate"
): ValidationChain[] => [
  body([startField, endField]).custom((value, { req }) => {
    const startDate = new Date(req.body[startField]);
    const endDate = new Date(req.body[endField]);

    if (startDate >= endDate) {
      throw new Error("Start date must be before end date");
    }
    return true;
  }),
];

/**
 * Validates amount/price fields
 */
export const validateAmount = (
  field: string = "amount",
  required: boolean = true,
  min: number = 0,
  max: number = 10000000
): ValidationChain[] => {
  const chain = [
    body(field)
      .isFloat({ min, max })
      .withMessage(`${field} must be a number between ${min} and ${max}`)
      .toFloat(),
  ];

  if (required) {
    return [
      body(field).notEmpty().withMessage(`${field} is required`),
      ...chain,
    ];
  }
  return chain;
};

/**
 * Validates enum values
 */
export const validateEnum = (
  field: string,
  validValues: string[],
  required: boolean = true
): ValidationChain[] => {
  const chain = [
    body(field)
      .isIn(validValues)
      .withMessage(`${field} must be one of: ${validValues.join(", ")}`),
  ];

  if (required) {
    return [
      body(field).notEmpty().withMessage(`${field} is required`),
      ...chain,
    ];
  }
  return chain;
};

// ==================== COMPOSITE VALIDATIONS ====================

/**
 * Validates property creation/update data
 */
export const validatePropertyData = (): ValidationChain[] => [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),
  body("bhk")
    .notEmpty()
    .withMessage("BHK is required")
    .isIn(["ONE_BHK", "TWO_BHK", "THREE_BHK", "FOUR_BHK_PLUS"])
    .withMessage("Invalid BHK type"),
  body("rent")
    .notEmpty()
    .withMessage("Rent is required")
    .isFloat({ min: 0 })
    .withMessage("Rent must be a positive number")
    .toFloat(),
  body("furnishing")
    .notEmpty()
    .withMessage("Furnishing is required")
    .isIn(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"])
    .withMessage("Invalid furnishing type"),
  body("tenantType")
    .notEmpty()
    .withMessage("Tenant type is required")
    .isIn(["FAMILY", "BACHELORS", "BOTH"])
    .withMessage("Invalid tenant type"),
  ...validateAddress(),
  ...validateAmenities(),
];

/**
 * Validates user profile update data
 */
export const validateUserProfile = (): ValidationChain[] => [
  ...validateName("fullName", false),
  ...validatePhone("phone", false),
  body("avatarUrl")
    .optional()
    .isURL()
    .withMessage("Avatar URL must be a valid URL")
    .trim(),
];

/**
 * Validates lead/contact message
 */
export const validateLeadMessage = (): ValidationChain[] => [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),
  ...validateMessage("message", true, 10),
  body("contactMethod")
    .optional()
    .isIn(["WHATSAPP", "PHONE", "EMAIL"])
    .withMessage("Contact method must be WHATSAPP, PHONE, or EMAIL"),
];

/**
 * Validates visit scheduling
 */
export const validateVisitSchedule = (): ValidationChain[] => [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),
  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled date is required")
    .isISO8601()
    .withMessage("Date must be valid")
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
    .withMessage("Time must be in HH:MM format"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters")
    .escape(),
];
