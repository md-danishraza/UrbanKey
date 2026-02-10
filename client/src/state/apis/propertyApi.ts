import { api } from "../api";

// Define Types for Request/Response to ensure Type Safety
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
}

interface GetPropertiesParams {
  location?: string;
  minPrice?: number;
}

// Inject endpoints into the parent api
export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<Property[], GetPropertiesParams>({
      query: (params) => ({
        url: "/properties",
        method: "GET",
        params: params, // Automatically converts to query string ?location=xyz
      }),
      providesTags: ["Property"], // Used for Caching
    }),

    getPropertyById: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    createProperty: builder.mutation<Property, Partial<Property>>({
      query: (newProperty) => ({
        url: "/properties",
        method: "POST",
        body: newProperty,
      }),
      // Invalidates cache so the list updates automatically
      invalidatesTags: ["Property"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
} = propertyApi;
