// # Property CRUD
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../config/database.js";

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure user exists in our DB (should already be synced via webhook)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(403).json({ error: "User not found in database" });
    }

    // Optional: Check if user is landlord, otherwise create with landlord role?
    // You might want to allow tenants to create properties? Usually only landlords.

    const propertyData = req.body;
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        landlordId: userId,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
