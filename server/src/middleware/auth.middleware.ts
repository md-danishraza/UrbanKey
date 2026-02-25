import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
    claims?: any;
  };
}

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

    // Verify the token using Clerk's verifyToken
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
      // Optionally set authorizedParties if needed
    });

    req.auth = {
      userId: payload.sub, // 'sub' contains the user ID
      sessionId: payload.sid,
      claims: payload,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
