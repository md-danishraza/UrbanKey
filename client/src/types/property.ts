export interface Property {
  id: string;
  title: string;
  description: string;
  bhk: "1BHK" | "2BHK" | "3BHK" | "4BHK+";
  rent: number;
  furnishing: "unfurnished" | "semi-furnished" | "fully-furnished";
  tenant_type: "family" | "bachelors" | "both";
  is_active: boolean;
  is_broker: boolean;
  brokerage_fee?: number;

  // Address
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;

  // Location
  latitude?: number;
  longitude?: number;

  // Indian context features
  has_water_247: boolean;
  has_power_backup: boolean;
  has_igl_pipeline: boolean;

  // Metro info
  nearest_metro_station?: string;
  distance_to_metro_km?: number;

  // Images
  images: string[];

  // Landlord info
  landlord_id: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_avatar?: string;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  city?: string;
  minRent: number;
  maxRent: number;
  bhk: string[];
  furnishing: string[];
  tenantType: "family" | "bachelors" | "both";
  hasWater247: boolean;
  hasPowerBackup: boolean;
  hasIglPipeline: boolean;
  isDirectOwner?: boolean;
  nearbyMetro?: boolean;
}

export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}
