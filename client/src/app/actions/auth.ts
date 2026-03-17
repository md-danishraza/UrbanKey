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

// export async function uploadVerificationDocument(formData: FormData) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return { success: false, error: "Unauthorized" };
//     }

//     const documentType = formData.get("documentType") as string;
//     const file = formData.get("file") as File;

//     if (!documentType || !file) {
//       return { success: false, error: "Missing document type or file" };
//     }

//     // Create a new FormData for the backend
//     const backendFormData = new FormData();
//     backendFormData.append("file", file);
//     backendFormData.append("documentType", documentType);

//     // Get token for API call
//     const token = await auth().then((a) => a.getToken());

//     // Upload to your backend
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: backendFormData,
//       }
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Upload failed");
//     }

//     const data = await response.json();

//     return {
//       success: true,
//       document: data.document,
//     };
//   } catch (error) {
//     console.error("Error uploading document:", error);
//     return { success: false, error: "Failed to upload document" };
//   }
// }
