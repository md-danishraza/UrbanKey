"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const role = formData.get("role") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const onboardingCompleted = formData.get("onboardingCompleted") === "true";

    const client = await clerkClient();

    // Update user metadata in Clerk
    const updateData: any = {
      publicMetadata: {
        ...(role && { role }),
        ...(onboardingCompleted && { onboardingCompleted: true }),
        updatedAt: new Date().toISOString(),
      },
    };

    if (fullName) {
      updateData.firstName = fullName.split(" ")[0];
      updateData.lastName = fullName.split(" ").slice(1).join(" ") || " ";
    }

    if (phone) {
      updateData.phoneNumber = phone;
    }

    await client.users.updateUser(userId, updateData);

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export async function uploadVerificationDocument(formData: FormData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const documentType = formData.get("documentType") as string;
    const file = formData.get("file") as File;

    if (!documentType || !file) {
      return { success: false, error: "Missing document type or file" };
    }

    // Here you would upload to your backend/storage
    // For now, we'll just update Clerk metadata
    const client = await clerkClient();

    await client.users.updateUser(userId, {
      publicMetadata: {
        verificationDocs: {
          [documentType]: {
            uploadedAt: new Date().toISOString(),
            status: "pending",
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { success: false, error: "Failed to upload document" };
  }
}
