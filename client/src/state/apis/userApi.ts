import { toast } from "sonner";
import { api } from "../api";

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    memberSince?: string;
    wishlistCount?: number;
    totalProperties?: number;
    activeProperties?: number;
    totalLeads?: number;
    totalVisits?: number;
    activeAgreements?: number;
  };
  properties?: any[];
  wishlist?: any[];
  visits?: any[];
  leads?: any[];
  documents?: any[];
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
}

export interface UserStats {
  memberSince: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isVerified: boolean;
  role: string;
  wishlistCount?: number;
  totalProperties?: number;
  activeProperties?: number;
  totalLeads?: number;
  totalVisits?: number;
  activeAgreements?: number;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/users/me/profile",
      providesTags: ["User"],
      transformResponse: (response: any) => {
        // Handle response structure
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
    }),

    // Update user profile
    updateUserProfile: builder.mutation<UserProfile, UpdateProfileData>({
      query: (data) => ({
        url: "/users/me/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          toast.success(response.message || "Profile updated successfully");
          return response.data;
        }
        return response;
      },
      transformErrorResponse: (error: any) => {
        toast.error(error.data?.message || "Failed to update profile");
        return error;
      },
    }),

    // Get user statistics
    getUserStats: builder.query<UserStats, void>({
      query: () => "/users/me/stats",
      providesTags: ["User"],
      transformResponse: (response: any) => {
        if (response.success) {
          return response.stats;
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserStatsQuery,
} = userApi;
