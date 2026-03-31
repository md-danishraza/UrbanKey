"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkWishlistStatus,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/api/wishlist";

export function useWishlist(propertyId?: string) {
  const { getToken, isSignedIn } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!propertyId || !isSignedIn) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("unauthorized");
      const response: any = await checkWishlistStatus(token, propertyId);
      setIsInWishlist(response.isInWishlist);
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  }, [propertyId, getToken, isSignedIn]);

  const toggleWishlist = useCallback(async () => {
    if (!propertyId || !isSignedIn) {
      toast.error("Please login to save properties");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("unauthorized");
      if (isInWishlist) {
        await removeFromWishlist(token, propertyId);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(token, propertyId);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, isInWishlist, getToken, isSignedIn]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { isInWishlist, isLoading, toggleWishlist, checkStatus };
}
