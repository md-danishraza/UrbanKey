import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import prisma from "../config/database.js";

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
    claims?: any;
    userRole?: string;
  };
}

/**
 * Authentication Middleware
 * Verifies JWT token from Clerk and attaches user info to request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 *
 * @throws 401 - Missing or invalid token
 * @throws 401 - Token verification failed
 */
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = header.substring(7);

    // Verify with Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const userId = payload.sub;
    let userRole = "TENANT";

    // Get user role from Clerk public metadata first
    const metadata = (payload.publicMetadata as Record<string, any>) || {};
    const clerkRole = metadata.role as string;

    // Check if user is admin via environment variable
    const adminUserId = process.env.ADMIN_USER_ID;
    const isAdminByEnv = adminUserId === userId;

    if (clerkRole) {
      // Convert to uppercase for consistency
      userRole = clerkRole.toUpperCase();
    } else if (isAdminByEnv) {
      userRole = "ADMIN";
    } else {
      // Fallback to database
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        userRole = user?.role || "TENANT";
      } catch (error) {
        console.error("Error fetching user role from database:", error);
      }
    }

    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      claims: payload,
      userRole,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * Role-Based Access Middleware
 * Checks if user has required role(s)
 *
 * @param roles - Array of allowed roles
 * @returns Express middleware function
 *
 * @throws 403 - Insufficient permissions
 */
// Role-based middleware helpers
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.auth?.userRole;
    // console.log(userRole);

    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

export const requireAdmin = requireRole(["ADMIN"]);
export const requireLandlord = requireRole(["LANDLORD", "ADMIN"]);
export const requireTenant = requireRole(["TENANT", "ADMIN"]);
