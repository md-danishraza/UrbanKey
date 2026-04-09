import type { Request, Response } from "express";
import { Webhook } from "svix";
import prisma from "../config/database.js";

/**
 * Clerk Webhook Handler
 * Receives and processes user lifecycle events from Clerk
 * Events handled: user.created, user.updated, user.deleted
 */
export const clerkWebhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const headers = req.headers;

  // Initialize webhook verifier with secret key
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    // Verify the webhook signature to ensure it's from Clerk
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({
      success: false,
      error: "Invalid signature",
      message: "Webhook signature verification failed",
    });
  }

  const eventType = evt.type;
  const {
    id,
    email_addresses,
    phone_numbers,
    first_name,
    last_name,
    image_url,
  } = evt.data;

  // Extract primary email and phone from Clerk data
  const primaryEmail = email_addresses?.find(
    (e: any) => e.id === evt.data.primary_email_address_id
  )?.email_address;

  const primaryPhone = phone_numbers?.find(
    (p: any) => p.id === evt.data.primary_phone_number_id
  )?.phone_number;

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated":
        // Upsert user (create if not exists, update if exists)
        await prisma.user.upsert({
          where: { id },
          update: {
            email: primaryEmail,
            phone: primaryPhone,
            fullName: `${first_name || ""} ${last_name || ""}`.trim(),
            avatarUrl: image_url,
          },
          create: {
            id,
            email: primaryEmail,
            phone: primaryPhone,
            fullName: `${first_name || ""} ${last_name || ""}`.trim(),
            avatarUrl: image_url,
            role: "TENANT", // Default role, will be updated during onboarding
          },
        });
        console.log(`✅ User ${eventType}: ${id}`);
        break;

      case "user.deleted":
        // Soft delete or hard delete user
        await prisma.user.delete({ where: { id } }).catch(() => {});
        console.log(`✅ User deleted: ${id}`);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`);
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to process webhook",
    });
  }
};
