import { apiClient } from "./api-client";

export interface Visit {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    images: { imageUrl: string; isPrimary: boolean }[];
    addressLine1: string;
    city: string;
  };
  tenant: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
}

// Create a visit request (tenant)
export const createVisit = async (
  token: string,
  data: {
    propertyId: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  }
) => {
  return apiClient.post("/api/visits", data, token);
};

// Get my visits (tenant)
export const getMyVisits = async (token: string) => {
  return apiClient.get("/api/visits/my-visits", token);
};

// Get landlord visits (landlord)
export const getLandlordVisits = async (
  token: string,
  filters?: {
    status?: string;
    propertyId?: string;
  }
) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.propertyId) params.append("propertyId", filters.propertyId);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get(`/api/visits/landlord${query}`, token);
};

// Update visit status (landlord)
export const updateVisitStatus = async (
  token: string,
  visitId: string,
  status: string
) => {
  return apiClient.patch(`/api/visits/${visitId}/status`, { status }, token);
};
