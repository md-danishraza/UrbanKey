import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
    claims?: any;
  };
}

// Test users for development
const TEST_USERS = {
  test_user_1: { id: "test_user_1", role: "TENANT" },
  test_user_2: { id: "test_user_2", role: "LANDLORD" },
  test_user_3: { id: "test_user_3", role: "ADMIN" },
};

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

    // DEVELOPMENT MODE: Check for test tokens
    if (process.env.NODE_ENV === "development") {
      // Check if token is a test token (starts with 'test_')
      if (token.startsWith("test_")) {
        const userId = token; // token itself is the user ID in test mode

        if (TEST_USERS[userId as keyof typeof TEST_USERS]) {
          req.auth = {
            userId: userId,
            sessionId: `test_session_${Date.now()}`,
            claims: {
              sub: userId,
              role: TEST_USERS[userId as keyof typeof TEST_USERS].role,
            },
          };
          return next();
        }
      }
    }

    // PRODUCTION MODE: Verify with Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      claims: payload,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
