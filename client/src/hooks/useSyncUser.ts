import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";

export function useSyncUser() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const syncUserWithBackend = async () => {
      try {
        // Check if user exists in backend
        const existingUser = await apiClient.get("/users/me");

        // If not, create or update
        if (!existingUser) {
          await apiClient.post("/users", {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            fullName: user.fullName,
            avatarUrl: user.imageUrl,
          });
        }
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, user]);
}
