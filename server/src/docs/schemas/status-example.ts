/**
 * HTTP Status Code Examples for OpenAPI Documentation
 */

/**
 * 200 OK - Success Response Example
 */
export const SuccessExample = {
  description: "OK - Request successful",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object" },
          message: { type: "string" },
        },
      },
      example: {
        success: true,
        message: "Operation completed successfully",
        data: {
          id: "cm5zj87d0000wk55xapojt75",
          title: "Modern 2BHK in Whitefield",
        },
      },
    },
  },
};

/**
 * 201 Created - Resource Created Example
 */
export const CreatedExample = {
  description: "Created - Resource created successfully",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      example: {
        success: true,
        message: "Property created successfully",
        data: {
          id: "cm5zj87d0000wk55xapojt75",
          title: "Modern 2BHK in Whitefield",
          createdAt: "2024-01-15T10:30:00.000Z",
        },
      },
    },
  },
};

/**
 * 400 Bad Request - Validation Error Example
 */
export const BadRequestExample = {
  description: "Bad Request - Invalid input or validation failed",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string" },
          message: { type: "string" },
          details: { type: "object" },
        },
      },
      examples: {
        missingField: {
          summary: "Missing required field",
          value: {
            success: false,
            error: "Validation failed",
            message: "Title is required",
          },
        },
        invalidFormat: {
          summary: "Invalid email format",
          value: {
            success: false,
            error: "Validation failed",
            details: {
              email: ["Valid email address is required"],
            },
          },
        },
        dateRange: {
          summary: "Invalid date range",
          value: {
            success: false,
            error: "Validation failed",
            message: "End date must be after start date",
          },
        },
      },
    },
  },
};

/**
 * 401 Unauthorized - Authentication Required Example
 */
export const UnauthorizedExample = {
  description: "Unauthorized - Authentication required or invalid token",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      examples: {
        missingToken: {
          summary: "Missing authentication token",
          value: {
            error: "Missing or invalid token",
          },
        },
        invalidToken: {
          summary: "Invalid or expired token",
          value: {
            error: "Unauthorized",
          },
        },
      },
    },
  },
};

/**
 * 403 Forbidden - Permission Denied Example
 */
export const ForbiddenExample = {
  description: "Forbidden - Insufficient permissions",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      examples: {
        wrongRole: {
          summary: "Insufficient role",
          value: {
            error: "Forbidden: Admin access required",
          },
        },
        notOwner: {
          summary: "Not resource owner",
          value: {
            error: "Forbidden: You do not own this property",
          },
        },
      },
    },
  },
};

/**
 * 404 Not Found - Resource Not Found Example
 */
export const NotFoundExample = {
  description: "Not Found - Requested resource does not exist",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      examples: {
        propertyNotFound: {
          summary: "Property not found",
          value: {
            error: "Property not found",
            message: "Property with ID cm5zj87d0000wk55xapojt75 does not exist",
          },
        },
        userNotFound: {
          summary: "User not found",
          value: {
            error: "User not found",
          },
        },
      },
    },
  },
};

/**
 * 409 Conflict - Resource Conflict Example
 */
export const ConflictExample = {
  description: "Conflict - Resource already exists or state conflict",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      examples: {
        alreadyInWishlist: {
          summary: "Property already in wishlist",
          value: {
            error: "Already in wishlist",
          },
        },
        propertyOccupied: {
          summary: "Property already occupied",
          value: {
            error: "Property is already occupied",
          },
        },
      },
    },
  },
};

/**
 * 429 Too Many Requests - Rate Limit Exceeded Example
 */
export const TooManyRequestsExample = {
  description: "Too Many Requests - Rate limit exceeded",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      example: {
        error: "Too many requests, please slow down",
      },
    },
  },
};

/**
 * 500 Internal Server Error - Server Error Example
 */
export const ServerErrorExample = {
  description: "Internal Server Error - Something went wrong on the server",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      example: {
        error: "Internal server error",
        message: "Failed to process request",
      },
    },
  },
};
