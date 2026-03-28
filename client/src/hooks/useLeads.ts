"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { getLandlordLeads, updateLeadStatus, Lead } from "@/lib/api/leads";

export function useLandlordLeads(filters?: {
  status?: string;
  propertyId?: string;
}) {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const loadLeads = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("not authorized");
        const response: any = await getLandlordLeads(token, {
          ...filters,
          page,
          limit: 10,
        });
        setLeads(response.leads);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to load leads:", error);
        toast.error("Failed to load leads");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, getToken]
  );

  const updateStatus = useCallback(
    async (leadId: string, status: string) => {
      try {
        const token = await getToken();
        if (!token) throw new Error("not authorized");
        await updateLeadStatus(token, leadId, status);
        toast.success("Lead status updated");
        loadLeads(pagination.page);
      } catch (error) {
        console.error("Failed to update lead status:", error);
        toast.error("Failed to update status");
      }
    },
    [getToken, loadLeads, pagination.page]
  );

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return { leads, isLoading, pagination, loadLeads, updateStatus };
}
