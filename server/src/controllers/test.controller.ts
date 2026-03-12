import type { Request, Response } from "express";
import { createClerkClient } from "@clerk/backend";
import prisma from "../config/database.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Store test users in memory (for development only)
const TEST_USERS = [
  {
    id: "test_user_1",
    email: "tenant@example.com",
    fullName: "Rahul Sharma",
    role: "TENANT",
  },
  {
    id: "test_user_2",
    email: "landlord@example.com",
    fullName: "Amit Kumar",
    role: "LANDLORD",
  },
  {
    id: "test_user_3",
    email: "admin@example.com",
    fullName: "Priya Singh",
    role: "ADMIN",
  },
];

export const getTestToken = async (req: Request, res: Response) => {
  try {
    // Get user type from query param (default to tenant)
    const userType = (req.query.type as string) || "tenant";

    let testUser;
    if (userType === "landlord") {
      testUser = TEST_USERS[1];
    } else if (userType === "admin") {
      testUser = TEST_USERS[2];
    } else {
      testUser = TEST_USERS[0];
    }

    // In development, we'll create a mock token
    // Note: This is for testing ONLY. In production, use proper Clerk tokens
    if (!testUser) {
      return res
        .status(400)
        .json({ error: "Invalid user type or test user not found" });
    }

    const mockToken = Buffer.from(
      JSON.stringify({
        sub: testUser.id,
        sid: `test_session_${Date.now()}`,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString("base64");

    res.json({
      success: true,
      token: mockToken,
      userId: testUser.id,
      user: testUser,
      message:
        "This is a test token. In production, use proper Clerk JWT tokens.",
    });
  } catch (error) {
    console.error("Error generating test token:", error);
    res.status(500).json({ error: "Failed to generate test token" });
  }
};

// Helper to create test users in your database
export const seedTestUsers = async (req: Request, res: Response) => {
  try {
    const createdUsers = [];
    for (const testUser of TEST_USERS) {
      const user = await prisma.user.upsert({
        where: { id: testUser.id },
        update: {},
        create: {
          id: testUser.id,
          email: testUser.email,
          fullName: testUser.fullName,
          role: testUser.role as any,
          isVerified: true,
          phone: `+91987654321${TEST_USERS.indexOf(testUser)}`,
        },
      });
      createdUsers.push(user);
    }

    res.json({
      success: true,
      message: "Test users created successfully",
      users: createdUsers,
    });
  } catch (error) {
    console.error("Error seeding test users:", error);
    res.status(500).json({ error: "Failed to seed test users" });
  }
};
