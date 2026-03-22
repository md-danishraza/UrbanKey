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
