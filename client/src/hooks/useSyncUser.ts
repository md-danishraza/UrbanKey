import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";

export function useSyncUser() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  // Prevent double-firing in React Strict Mode
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user || hasSynced.current) return;
    // console.log(user);

    const syncUserWithBackend = async () => {
      try {
        hasSynced.current = true;

        // Securely get the JWT token from Clerk
        const token = await getToken();

        // Call the single UPSERT endpoint on your Node.js backend
        await apiClient.post(
          "/api/users/sync",
          {
            email: user.primaryEmailAddress?.emailAddress,
            // user.fullName is automatically provided by Clerk (combines first & last)
            fullName: user.fullName ?? user.username,
            avatarUrl: user.imageUrl,
            role: "TENANT",
          },
          token
        );

        console.log("User synced successfully with backend database!");
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
        hasSynced.current = false; // Allow retry if it failed
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, user, getToken]);
}
