"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/state";
// import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface UseWishlistReturn {
  isInWishlist: boolean;
  toggleWishlist: () => Promise<void>;
  wishlistCount: number;
  loading: boolean;
}

export function useWishlist(propertyId: string): UseWishlistReturn {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  //   will set auth later
  //   const { user } = useAuth();
  const user = null;

  const dispatch = useAppDispatch();

  // You can connect this to your Redux store later
  // For now, we'll use local state with localStorage for demo

  useEffect(() => {
    if (!user) return;

    // Load wishlist from localStorage (replace with API call later)
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.includes(propertyId));
  }, [propertyId, user]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to save properties");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update localStorage (replace with actual API call)
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (isInWishlist) {
        const newWishlist = wishlist.filter((id: string) => id !== propertyId);
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        wishlist.push(propertyId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    isInWishlist,
    toggleWishlist,
    wishlistCount: 0, // Will be implemented with actual data
    loading,
  };
}
