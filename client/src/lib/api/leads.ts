import { apiClient } from "./api-client";

export interface Lead {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    images: { imageUrl: string; isPrimary: boolean }[];
    rent: number;
  };
  tenant: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  message: string;
  contactMethod: "WHATSAPP" | "PHONE" | "EMAIL";
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  createdAt: string;
}

// Create a lead (tenant)
export const createLead = async (
  token: string,
  data: {
    propertyId: string;
    message: string;
    contactMethod: string;
  }
) => {
  return apiClient.post("/api/leads", data, token);
};

// Get my leads (tenant)
export const getMyLeads = async (token: string) => {
  return apiClient.get("/api/leads/my-leads", token);
};

// Get landlord leads (landlord)
export const getLandlordLeads = async (
  token: string,
  filters?: {
    status?: string;
    propertyId?: string;
    page?: number;
    limit?: number;
  }
) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.propertyId) params.append("propertyId", filters.propertyId);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get(`/api/leads/landlord${query}`, token);
};

// Update lead status (landlord)
export const updateLeadStatus = async (
  token: string,
  leadId: string,
  status: string
) => {
  return apiClient.patch(`/api/leads/${leadId}/status`, { status }, token);
};
