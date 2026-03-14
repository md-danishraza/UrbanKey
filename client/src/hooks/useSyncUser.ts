import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";

export function useSyncUser() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth(); // Safely get token on the client
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user || hasSynced.current) return;

    const syncUserWithBackend = async () => {
      try {
        hasSynced.current = true;
        const token = await getToken();

        // Pass the token to the API client
        const existingUser = await apiClient.get("/users/me", token);

        if (!existingUser) {
          await apiClient.post(
            "/users",
            {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              avatarUrl: user.imageUrl,
              role: "TENANT",
            },
            token
          );
        }
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
        hasSynced.current = false; // Allow retry if failed
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, user, getToken]);
}
