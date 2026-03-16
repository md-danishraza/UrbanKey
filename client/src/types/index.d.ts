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

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "tenant" | "landlord" | "admin";
      isVerified?: boolean;
      onboardingCompleted?: boolean;
    };
    publicMetadata?: {
      role?: "tenant" | "landlord" | "admin";
      isVerified?: boolean;
    };
  }
}
