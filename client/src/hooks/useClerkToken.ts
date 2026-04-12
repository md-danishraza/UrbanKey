"use client";

import { useAuth } from "@clerk/nextjs";

export const useClerkToken = () => {
  const { getToken } = useAuth();

  const fetchToken = async () => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("Failed to get Clerk token:", error);
      return null;
    }
  };

  return fetchToken();
};
