import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

// 1. Define your Tag Types (Cache Keys)
// Add 'User', 'Property', 'Review' etc. here so you can invalidate them later
export const tagTypes = ["User", "Property", "Booking"] as const;

// 2. Configure the Base Query
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    // If you have a token in localStorage or cookie, attach it here
    // With Clerk, you might pass the token via a prop or middleware,
    // but often Clerk handles cookies automatically.
    // Example: headers.set("Authorization", `Bearer ${token}`);
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

  if (result.error) {
    // Handle different error status codes
    const status = result.error.status;
    const data: any = result.error.data;

    const errorMessage = data?.message || "Something went wrong";

    if (status === 401) {
      toast.error("Unauthorized. Please sign in.");
      // Optional: Dispatch a logout action here
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status === "FETCH_ERROR") {
      toast.error("Network error. Please check your connection.");
    } else {
      // Server error or validation error
      toast.error(errorMessage);
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
