import { apiClient } from "./api-client";

export interface WishlistItem {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    rent: number;
    bhk: string;
    city: string;
    images: { imageUrl: string; isPrimary: boolean }[];
    nearestMetroStation?: string;
    distanceToMetroKm?: number;
    isBroker?: boolean;
    brokerageFee?: number;
    landlord: { fullName: string };
  };
  createdAt: string;
}
// Get wishlist (tenant)
export const getWishlist = async (token: string) => {
  return apiClient.get("/api/wishlist", token);
};

// Get wishlist count
export const getWishlistCount = async (token: string) => {
  return apiClient.get("/api/wishlist/count", token);
};

// Check if property is in wishlist
export const checkWishlistStatus = async (
  token: string,
  propertyId: string
) => {
  return apiClient.get(`/api/wishlist/${propertyId}/status`, token);
};

// Add to wishlist
export const addToWishlist = async (token: string, propertyId: string) => {
  return apiClient.post(`/api/wishlist/${propertyId}`, {}, token);
};

// Remove from wishlist
export const removeFromWishlist = async (token: string, propertyId: string) => {
  return apiClient.delete(`/api/wishlist/${propertyId}`, token);
};
