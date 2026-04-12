import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

// 1. Define your Tag Types (Cache Keys)
export const tagTypes = [
  "User",
  "Property",
  "Booking",
  "Wishlist",
  "Lead",
  "Visit",
] as const;

// Helper to get Clerk token dynamically on the client side
// so that Redux store is completely decoupled from React hooks (for token)
const getClerkTokenClient = async () => {
  try {
    // Check if we are in the browser and Clerk has initialized
    if (typeof window !== "undefined" && window.Clerk && window.Clerk.session) {
      return await window.Clerk.session.getToken();
    }
    return null;
  } catch (error) {
    console.error("Failed to get Clerk token:", error);
    return null;
  }
};

// 2. Configure the Base Query with Clerk token
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  prepareHeaders: async (headers) => {
    try {
      const token = await getClerkTokenClient();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error setting auth header:", error);
    }
    return headers;
  },
});

// 3. Custom Base Query Wrapper (For Global Error Handling)
const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const result = await baseQuery(args, api, extraOptions);
  // console.log(result);

  if (result.error) {
    const status = result.error.status;
    const data: any = result.error.data;

    // Extract error message from different response formats
    let errorMessage = "Something went wrong";

    if (data) {
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && Array.isArray(data.errors)) {
        // Handle validation errors
        errorMessage = data.errors
          .map((err: any) => err.msg || err.message)
          .join(", ");
      }
    }

    // Handle different error status codes
    if (status === 401) {
      toast.error("Unauthorized. Please sign in again.");
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status === 404) {
      // Don't show toast for 404s as they're often handled by components
      console.error("Resource not found:", errorMessage);
    } else if (status === 429) {
      toast.error("Too many requests. Please try again later.");
    } else if (status === "FETCH_ERROR") {
      toast.error("Network error. Please check your connection.");
    } else if (status && (status as number) >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      // Only show toast for client errors that aren't 404
      if (status !== 404) {
        toast.error(errorMessage);
      }
    }
  }

  return result;
};

// 4. Create the API Slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: tagTypes,
  endpoints: () => ({}), // We inject endpoints in separate files
});
