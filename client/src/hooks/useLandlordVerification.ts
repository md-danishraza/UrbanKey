"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/api-client";

export function useLandlordVerification(redirectOnFailure: boolean = true) {
  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until Clerk fully loads the user object
    if (!isLoaded) return;

    if (!isSignedIn) {
      setIsVerified(false);
      setIsLoading(false);
      return;
    }

    const checkVerification = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("No auth token");

        const response: any = await apiClient.get(
          "/api/users/landlord/isVerified",
          token
        );

        // FIX 1: Safely parse the verified boolean regardless of how your backend nests it
        // We force it to a strict boolean so it NEVER becomes 'undefined' or 'null'
        const backendVerified =
          response.isVerified === true ||
          response.data?.isVerified === true ||
          response.verified === true;

        // FIX 2: Check Clerk's local metadata as a safety fallback
        const clerkVerified = user?.publicMetadata?.isVerified === true;
        const finalVerifiedStatus = backendVerified || clerkVerified;

        setIsVerified(finalVerifiedStatus);

        if (!finalVerifiedStatus && redirectOnFailure) {
          // FIX 3: Prevent infinite redirect loops if we are already on the onboarding page
          if (!pathname.includes("/onboarding/landlord")) {
            toast.warning(
              response.message ||
                "Please complete verification to access this page"
            );
            router.push("/onboarding/landlord");
          }
        }
      } catch (err: any) {
        console.error("Error checking landlord verification:", err);
        setError(err.message || "Failed to check verification status");

        // FIX 4: Ensure state is explicitly set to false on error (not left as null)
        setIsVerified(false);

        if (redirectOnFailure && !pathname.includes("/onboarding/landlord")) {
          toast.error("Unable to verify landlord status");
          router.push("/onboarding/landlord");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [
    isSignedIn,
    isLoaded,
    user,
    getToken,
    router,
    pathname,
    redirectOnFailure,
  ]);

  return { isVerified, isLoading, error };
}
