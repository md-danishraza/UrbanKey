import { apiClient } from "./api-client";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Document {
  id: string;
  userId: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  user: User;
}

export interface VerificationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  daily: Array<{ status: string; _count: { status: number } }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DocumentsResponse {
  success: boolean;
  documents: Document[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  success: boolean;
  stats: VerificationStats;
}

export async function getPendingVerifications(
  token: string | null
): Promise<DocumentsResponse> {
  if (!token) throw new Error("No auth token");
  return apiClient.get("/api/admin/verifications/pending", token);
}

export async function getAllVerifications(
  token: string | null,
  status?: string,
  page?: number,
  limit?: number
): Promise<DocumentsResponse> {
  if (!token) throw new Error("No auth token");
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get(`/api/admin/verifications/all${query}`, token);
}

export async function getVerificationStats(
  token: string | null
): Promise<StatsResponse> {
  if (!token) throw new Error("No auth token");
  return apiClient.get("/api/admin/verifications/stats", token);
}

export async function approveDocument(
  token: string | null,
  documentId: string
): Promise<ApiResponse<Document>> {
  if (!token) throw new Error("No auth token");
  return apiClient.post(
    `/api/admin/verifications/${documentId}/approve`,
    {},
    token
  );
}

export async function rejectDocument(
  token: string | null,
  documentId: string,
  reason: string
): Promise<ApiResponse<Document>> {
  if (!token) throw new Error("No auth token");
  return apiClient.post(
    `/api/admin/verifications/${documentId}/reject`,
    { reason },
    token
  );
}

export async function getDocumentById(
  token: string | null,
  documentId: string
): Promise<{ success: boolean; document: Document }> {
  if (!token) throw new Error("No auth token");
  return apiClient.get(`/api/admin/verifications/${documentId}`, token);
}

//  Properties mgt
export interface AdminProperty {
  id: string;
  title: string;
  description: string;
  bhk: string;
  rent: number;
  furnishing: string;
  tenantType: string;
  isActive: boolean;
  city: string;
  addressLine1: string;
  landlord: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  images: { imageUrl: string; isPrimary: boolean }[];
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  updatedAt: string;
  views?: number;
  leads?: number;
}

export interface AdminPropertyStats {
  totalProperties: number;
  activeProperties: number;
  inactiveProperties: number;
  totalViews: number;
  totalLeads: number;
  pending?: number;
}

// Get all properties with filters (admin view)
export async function getAdminProperties(
  token: string | null,
  filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<{
  data: AdminProperty[];
  total: number;
  page: number;
  totalPages: number;
}> {
  if (!token) throw new Error("No auth token");

  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get(`/api/admin/properties${query}`, token);
}

// Get property statistics for admin
export async function getAdminPropertyStats(
  token: string | null
): Promise<AdminPropertyStats> {
  if (!token) throw new Error("No auth token");
  return apiClient.get("/api/admin/properties/stats", token);
}

// Update property status (activate/deactivate)
export async function updatePropertyStatus(
  token: string | null,
  propertyId: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  if (!token) throw new Error("No auth token");
  return apiClient.patch(
    `/api/admin/properties/${propertyId}/status`,
    { isActive },
    token
  );
}

// Delete property
export async function deleteProperty(
  token: string | null,
  propertyId: string
): Promise<{ success: boolean; message: string }> {
  if (!token) throw new Error("No auth token");
  return apiClient.delete(`/api/admin/properties/${propertyId}`, token);
}

// user mgt
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  properties?: any[];
  agreements?: any[];
}

export interface AdminUserStats {
  totalUsers: number;
  verified: number;
  unverified: number;
  tenants: number;
  landlords: number;
  admins: number;
}

// Get all users for admin
export async function getAdminUsers(
  token: string | null,
  filters?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<{
  data: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}> {
  if (!token) throw new Error("No auth token");

  const params = new URLSearchParams();
  if (filters?.role) params.append("role", filters.role);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get(`/api/admin/users${query}`, token);
}

// Get user statistics for admin
export async function getAdminUserStats(
  token: string | null
): Promise<AdminUserStats> {
  if (!token) throw new Error("No auth token");
  return apiClient.get("/api/admin/users/stats", token);
}

// Update user role
export async function updateUserRole(
  token: string | null,
  userId: string,
  role: string
): Promise<{ success: boolean; message: string }> {
  if (!token) throw new Error("No auth token");
  return apiClient.patch(`/api/admin/users/${userId}/role`, { role }, token);
}

// Verify user
export async function verifyUser(
  token: string | null,
  userId: string
): Promise<{ success: boolean; message: string }> {
  if (!token) throw new Error("No auth token");
  return apiClient.patch(`/api/admin/users/${userId}/verify`, {}, token);
}

// Suspend user (delete)
export async function suspendUser(
  token: string | null,
  userId: string
): Promise<{ success: boolean; message: string }> {
  if (!token) throw new Error("No auth token");
  return apiClient.delete(`/api/admin/users/${userId}`, token);
}
