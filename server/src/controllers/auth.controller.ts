// # Webhook handlers for Clerk events
import type { Request, Response } from "express";
import { Webhook } from "svix";
import prisma from "../config/database.js";

export const clerkWebhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    // Verify the webhook signature
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
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
            role: "TENANT", // default
          },
        });
        break;

      case "user.deleted":
        await prisma.user.delete({ where: { id } }).catch(() => {});
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
