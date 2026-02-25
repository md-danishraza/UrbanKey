// # Global error handler
import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
    statusCode: err.statusCode,
  });

  // Prisma errors
  if (err.code?.startsWith("P")) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          error: "Unique constraint violation",
          message: "A record with this value already exists",
        });
      case "P2025":
        return res.status(404).json({
          error: "Not found",
          message: "The requested record does not exist",
        });
      default:
        return res.status(500).json({
          error: "Database error",
          message: "An unexpected database error occurred",
        });
    }
  }

  // Custom errors with status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name || "Error",
      message: err.message,
    });
  }

  // Default server error
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

// Helper function to create custom errors
export const createError = (
  message: string,
  statusCode: number = 400
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};
