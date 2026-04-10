import { body, param, query } from "express-validator";

// ==================== AGREEMENT VALIDATIONS ====================

/**
 * Agreement creation validation
 */
export const validateCreateAgreement = () => [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),

  body("tenantId")
    .notEmpty()
    .withMessage("Tenant ID is required")
    .isString()
    .withMessage("Tenant ID must be a string"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .toDate(),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = req.body.startDate;
      if (startDate && new Date(endDate) <= new Date(startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("monthlyRent")
    .notEmpty()
    .withMessage("Monthly rent is required")
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("Monthly rent must be between 0 and 10,000,000")
    .toFloat(),

  body("securityDeposit")
    .notEmpty()
    .withMessage("Security deposit is required")
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("Security deposit must be between 0 and 10,000,000")
    .toFloat()
    .custom((deposit, { req }) => {
      const rent = req.body.monthlyRent;
      if (rent && deposit < rent) {
        throw new Error(
          "Security deposit should typically be at least 1 month rent"
        );
      }
      return true;
    }),

  body("maintenanceFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maintenance fee must be a positive number")
    .toFloat(),

  body("terms")
    .optional()
    .isString()
    .withMessage("Terms must be a string")
    .trim(),

  body("specialConditions")
    .optional()
    .isString()
    .withMessage("Special conditions must be a string")
    .trim(),
];

/**
 * Agreement ID validation
 */
export const validateAgreementId = () => [
  param("id")
    .notEmpty()
    .withMessage("Agreement ID is required")
    .isString()
    .withMessage("Agreement ID must be a string"),
];

/**
 * Agreement status filter validation
 */
export const validateAgreementFilters = () => [
  query("status")
    .optional()
    .isIn([
      "DRAFT",
      "PENDING_SIGNATURE",
      "ACTIVE",
      "EXPIRED",
      "TERMINATED",
      "ALL",
    ])
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

// ==================== PAYMENT VALIDATIONS ====================

/**
 * Payment recording validation
 */
export const validateRecordPayment = () => [
  body("agreementId")
    .notEmpty()
    .withMessage("Agreement ID is required")
    .isString()
    .withMessage("Agreement ID must be a string"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("Amount must be between 0 and 10,000,000")
    .toFloat(),

  body("paymentDate")
    .notEmpty()
    .withMessage("Payment date is required")
    .isISO8601()
    .withMessage("Payment date must be a valid date")
    .toDate(),

  body("type")
    .optional()
    .isIn(["RENT", "SECURITY_DEPOSIT", "MAINTENANCE", "LATE_FEE", "OTHER"])
    .withMessage("Invalid payment type"),

  body("month")
    .optional()
    .isInt({ min: 0, max: 36 })
    .withMessage("Month must be between 0 and 36")
    .toInt(),

  body("year")
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage("Year must be between 2020 and 2030")
    .toInt(),

  body("transactionId")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string")
    .trim(),

  body("paymentMethod")
    .optional()
    .isIn(["CASH", "BANK_TRANSFER", "UPI", "CHEQUE", "OTHER"])
    .withMessage("Invalid payment method"),

  body("status")
    .optional()
    .isIn(["PENDING", "PAID", "OVERDUE", "REFUNDED"])
    .withMessage("Invalid payment status"),
];

/**
 * Payment ID validation
 */
export const validatePaymentId = () => [
  param("id")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isString()
    .withMessage("Payment ID must be a string"),
];

/**
 * Payment status update validation
 */
export const validateUpdatePaymentStatus = () => [
  ...validatePaymentId(),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "PAID", "OVERDUE", "REFUNDED"])
    .withMessage("Status must be PENDING, PAID, OVERDUE, or REFUNDED"),
];
