import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import mbxMatrix from "@mapbox/mapbox-sdk/services/matrix";

// Initialize Mapbox client
const baseClient = (accessToken: string) => ({
  geocoding: mbxGeocoding({ accessToken }),
  directions: mbxDirections({ accessToken }),
  matrix: mbxMatrix({ accessToken }),
});

class MapboxService {
  private accessToken: string;
  private geocoding: any;
  private directions: any;

  constructor() {
    this.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    if (!this.accessToken) {
      console.warn(
        "Mapbox token not found. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local"
      );
    }
    const client = baseClient(this.accessToken);
    this.geocoding = client.geocoding;
    this.directions = client.directions;
  }

  /**
   * Geocode an address to coordinates
   */
  async geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await this.geocoding
        .forwardGeocode({
          query: address,
          limit: 1,
          countries: ["in"], // Limit to India
        })
        .send();

      if (response.body.features.length > 0) {
        const [lng, lat] = response.body.features[0].center;
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await this.geocoding
        .reverseGeocode({
          query: [lng, lat],
          limit: 1,
        })
        .send();

      if (response.body.features.length > 0) {
        return response.body.features[0].place_name;
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  }

  /**
   * Get distance to nearest metro station
   * This requires a list of metro station coordinates (you'll need to maintain this)
   */
  async getDistanceToNearestMetro(
    lat: number,
    lng: number,
    metroStations: Array<{ name: string; lat: number; lng: number }>
  ): Promise<{ stationName: string; distanceKm: number } | null> {
    try {
      let nearestStation = null;
      let minDistance = Infinity;

      for (const station of metroStations) {
        // Calculate approximate distance using Haversine formula
        const distance = this.calculateDistance(
          lat,
          lng,
          station.lat,
          station.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestStation = station;
        }
      }

      if (nearestStation) {
        return {
          stationName: nearestStation.name,
          distanceKm: Math.round(minDistance * 10) / 10,
        };
      }
      return null;
    } catch (error) {
      console.error("Distance calculation error:", error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const mapboxService = new MapboxService();
