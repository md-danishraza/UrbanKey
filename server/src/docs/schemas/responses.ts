/**
 * OpenAPI Shared Response Schemas
 * Reusable response structures for consistent API documentation
 */

/**
 * Success Response Schema
 * Used for all successful API responses
 */
export const SuccessResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      description: "Indicates if the operation was successful",
      example: true,
    },
    message: {
      type: "string",
      description: "Optional success message",
      example: "Operation completed successfully",
    },
    data: {
      type: "object",
      description: "Response data (varies by endpoint)",
      additionalProperties: true,
    },
  },
  required: ["success"],
};

/**
 * Error Response Schema
 * Used for all error responses (4xx, 5xx)
 */
export const ErrorResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      description: "Always false for error responses",
      example: false,
    },
    error: {
      type: "string",
      description: "Error code or type",
      example: "Validation failed",
    },
    message: {
      type: "string",
      description: "Human-readable error message",
      example: "Invalid input provided",
    },
    details: {
      type: "object",
      description: "Additional error details (optional)",
      additionalProperties: true,
    },
  },
  required: ["success", "error"],
};

/**
 * Validation Error Response Schema
 * Used when request validation fails (400)
 */
export const ValidationErrorResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: false,
    },
    error: {
      type: "string",
      example: "Validation failed",
    },
    details: {
      type: "object",
      properties: {
        field: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      example: {
        email: ["Email is required", "Invalid email format"],
        password: ["Password must be at least 6 characters"],
      },
    },
  },
};

/**
 * Pagination Response Schema
 * Used for list endpoints with pagination
 */
export const PaginationResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      description: "Array of items for current page",
      items: {
        type: "object",
      },
    },
    total: {
      type: "integer",
      description: "Total number of items available",
      example: 150,
      minimum: 0,
    },
    page: {
      type: "integer",
      description: "Current page number",
      example: 1,
      minimum: 1,
    },
    limit: {
      type: "integer",
      description: "Number of items per page",
      example: 10,
      minimum: 1,
      maximum: 100,
    },
    totalPages: {
      type: "integer",
      description: "Total number of pages available",
      example: 15,
      minimum: 0,
    },
  },
  required: ["data", "total", "page", "limit", "totalPages"],
};

/**
 * Empty Response Schema
 * Used for operations with no response body (204)
 */
export const EmptyResponseSchema = {
  description: "No content",
};

/**
 * ID Parameter Schema
 * Used for path parameters that accept IDs
 */
export const IdParameterSchema = {
  name: "id",
  in: "path",
  required: true,
  schema: {
    type: "string",
    description: "Unique identifier",
    example: "cm5zj87d0000wk55xapojt75",
  },
  description: "ID of the resource",
};

/**
 * Pagination Parameters Schema
 * Used for query parameters in list endpoints
 */
export const PaginationParametersSchema = [
  {
    name: "page",
    in: "query",
    schema: {
      type: "integer",
      minimum: 1,
      default: 1,
    },
    description: "Page number",
  },
  {
    name: "limit",
    in: "query",
    schema: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      default: 10,
    },
    description: "Number of items per page",
  },
];
