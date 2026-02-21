export * from "./property";

// Auth types
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: "tenant" | "landlord" | "admin";
  is_verified: boolean;
  avatar?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
