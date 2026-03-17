import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api/api-client";
import { usePathname } from "next/navigation";

export function useSyncUser() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const pathname = usePathname();

  // Prevent double-firing in React Strict Mode
  const hasSynced = useRef(false);

  useEffect(() => {
    // Pause sync during onboarding
    if (pathname?.includes("/onboarding")) {
      console.log("📝 Onboarding in progress - skipping sync");
      return;
    }

    if (!isSignedIn || !user || hasSynced.current) return;
    // console.log(user);

    const syncUserWithBackend = async () => {
      try {
        hasSynced.current = true;

        // Securely get the JWT token from Clerk
        const token = await getToken();

        // Get role from Clerk metadata (set during onboarding)
        const role = user.publicMetadata?.role || "TENANT";

        // Call the single UPSERT endpoint on your Node.js backend
        await apiClient.post(
          "/api/users/sync",
          {
            email: user.primaryEmailAddress?.emailAddress,
            // user.fullName is automatically provided by Clerk (combines first & last)
            fullName: user.fullName ?? user.username,
            avatarUrl: user.imageUrl,
            role: (role as string).toLocaleUpperCase(),
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
