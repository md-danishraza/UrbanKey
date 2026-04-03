"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkWishlistStatus,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/api/wishlist";

// Global cache for wishlist status
const wishlistCache = new Map<string, boolean>();

export function useWishlist(propertyId?: string) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isInWishlist, setIsInWishlist] = useState(() =>
    propertyId ? wishlistCache.get(propertyId) || false : false
  );
  const [isLoading, setIsLoading] = useState(false);
  const isTenant = user?.publicMetadata?.role === "tenant";

  const checkStatus = useCallback(async () => {
    if (!propertyId || !isSignedIn || !isTenant) return;

    // Check cache first
    if (wishlistCache.has(propertyId)) {
      setIsInWishlist(wishlistCache.get(propertyId)!);
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("unauthorized");
      const response: any = await checkWishlistStatus(token, propertyId);
      wishlistCache.set(propertyId, response.isInWishlist);
      setIsInWishlist(response.isInWishlist);
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  }, [propertyId, getToken, isSignedIn, isTenant]);

  const toggleWishlist = useCallback(async () => {
    if (!propertyId || !isSignedIn || !isTenant) {
      toast.error("Please login as a tenant to save properties");
      return;
    }

    setIsLoading(true);
    const previousStatus = isInWishlist;

    // Optimistic update
    setIsInWishlist(!previousStatus);
    wishlistCache.set(propertyId, !previousStatus);

    try {
      const token = await getToken();
      if (!token) throw new Error("unauthorized");
      if (previousStatus) {
        await removeFromWishlist(token, propertyId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(token, propertyId);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      // Revert on error
      setIsInWishlist(previousStatus);
      wishlistCache.set(propertyId, previousStatus);
      console.error("Failed to toggle wishlist:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, isInWishlist, getToken, isSignedIn, isTenant]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { isInWishlist, isLoading, toggleWishlist, checkStatus };
}
