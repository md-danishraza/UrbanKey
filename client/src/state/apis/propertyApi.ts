import { api } from "../api";
import { SearchFilters } from "@/types/property";

export interface Property {
  id: string;
  title: string;
  rent: number;
  bhk: string;
  city: string;
  latitude?: number;
  longitude?: number;
  images: { imageUrl: string; isPrimary: boolean }[];
  nearestMetroStation?: string;
  distanceToMetroKm?: number;
  isBroker?: boolean;
  brokerageFee?: number;
  isActive: boolean;
  createdAt: string;
  description?: string;
  furnishing?: string;
  tenantType?: string;
  addressLine1?: string;
  hasWater247?: boolean;
  hasPowerBackup?: boolean;
  hasIglPipeline?: boolean;
}

export interface PropertyStats {
  totalProperties: number;
  totalTenants: number;
  totalLandlords: number;
  totalAgreements: number;
}

export interface PropertyListResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SemanticSearchResponse {
  success: boolean;
  query: string;
  results: Property[];
  count: number;
}

export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedProperties: builder.query<Property[], void>({
      query: () => "/properties?limit=4&sort=createdAt",
      providesTags: ["Property"],
      transformResponse: (response: any) => {
        if (response.data) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
    }),

    getPlatformStats: builder.query<PropertyStats, void>({
      query: () => "/properties/stats",
      providesTags: ["Property"],
    }),

    // Fixed: Proper typing for filters parameter
    getProperties: builder.query<
      PropertyListResponse,
      {
        page?: number;
        limit?: number;
        filters?: SearchFilters;
      }
    >({
      query: ({ page = 1, limit = 9, filters }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // Add filter params only if they exist
        if (filters?.city) params.append("city", filters.city);
        if (filters?.minRent && filters.minRent > 0)
          params.append("minRent", filters.minRent.toString());
        if (filters?.maxRent && filters.maxRent < 100000)
          params.append("maxRent", filters.maxRent.toString());
        if (filters?.bhk && filters.bhk.length)
          params.append("bhk", filters.bhk.join(","));
        if (filters?.furnishing && filters.furnishing.length)
          params.append("furnishing", filters.furnishing.join(","));
        if (filters?.tenantType && filters.tenantType !== "both")
          params.append("tenantType", filters.tenantType);
        if (filters?.hasWater247) params.append("hasWater247", "true");
        if (filters?.hasPowerBackup) params.append("hasPowerBackup", "true");
        if (filters?.hasIglPipeline) params.append("hasIglPipeline", "true");
        if (filters?.isDirectOwner) params.append("isDirectOwner", "true");
        if (filters?.nearbyMetro) params.append("nearbyMetro", "true");

        return `/properties?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Property" as const,
                id,
              })),
              { type: "Property", id: "LIST" },
            ]
          : [{ type: "Property", id: "LIST" }],
    }),

    semanticSearch: builder.query<SemanticSearchResponse, string>({
      query: (query) => `/properties/semantic?q=${encodeURIComponent(query)}`,
      keepUnusedDataFor: 0,
    }),

    getAllPropertiesForMap: builder.query<Property[], void>({
      query: () => "/properties",
      providesTags: ["Property"],
      transformResponse: (response: any) => {
        if (response.data) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
    }),
  }),
});

export const {
  useGetFeaturedPropertiesQuery,
  useGetPlatformStatsQuery,
  useGetPropertiesQuery,
  useLazyGetPropertiesQuery,
  useSemanticSearchQuery,
  useLazySemanticSearchQuery,
  useGetAllPropertiesForMapQuery,
} = propertyApi;
