/**
 * Google Maps API Integration
 * - Distance Matrix API for transport time/cost calculations
 * - Static Maps API for satellite property images
 * - Geocoding for address validation
 */

// ============================================================================
// DISTANCE MATRIX API
// ============================================================================

export interface TravelTimeParams {
  origin: string | { lat: number; lng: number };
  destination: string | { lat: number; lng: number };
}

export interface TravelTimeResult {
  distanceMiles: number;
  durationMinutes: number;
  durationHours: number;
  status: 'OK' | 'ZERO_RESULTS' | 'ERROR';
  errorMessage?: string;
}

export async function calculateTravelTime(
  params: TravelTimeParams
): Promise<TravelTimeResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const originStr = typeof params.origin === 'string'
      ? params.origin
      : `${params.origin.lat},${params.origin.lng}`;

    const destinationStr = typeof params.destination === 'string'
      ? params.destination
      : `${params.destination.lat},${params.destination.lng}`;

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', originStr);
    url.searchParams.append('destinations', destinationStr);
    url.searchParams.append('units', 'imperial');
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      return {
        distanceMiles: 0,
        durationMinutes: 0,
        durationHours: 0,
        status: 'ERROR',
        errorMessage: data.error_message || 'Failed to calculate distance',
      };
    }

    const element = data.rows[0].elements[0];

    if (element.status !== 'OK') {
      return {
        distanceMiles: 0,
        durationMinutes: 0,
        durationHours: 0,
        status: 'ZERO_RESULTS',
        errorMessage: 'No route found',
      };
    }

    const distanceMeters = element.distance.value;
    const durationSeconds = element.duration.value;

    return {
      distanceMiles: distanceMeters / 1609.34, // meters to miles
      durationMinutes: durationSeconds / 60,
      durationHours: durationSeconds / 3600,
      status: 'OK',
    };
  } catch (error) {
    console.error('Travel time calculation error:', error);
    return {
      distanceMiles: 0,
      durationMinutes: 0,
      durationHours: 0,
      status: 'ERROR',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Calculate round-trip transport hours for pricing
 * From CLAUDE.md: Transport billed at reduced rate (default 50%)
 */
export interface TransportCostParams {
  origin: string | { lat: number; lng: number };
  destination: string | { lat: number; lng: number };
  transportRate?: number; // Default 0.5 (50% of loadout cost)
}

export interface TransportCostResult {
  distanceMiles: number;
  oneWayMinutes: number;
  roundTripHours: number;
  adjustedTransportHours: number; // After applying transport rate
  transportRate: number;
}

export async function calculateTransportCost(
  params: TransportCostParams
): Promise<TransportCostResult> {
  const { origin, destination, transportRate = 0.5 } = params;

  const travelTime = await calculateTravelTime({ origin, destination });

  if (travelTime.status !== 'OK') {
    throw new Error(travelTime.errorMessage || 'Failed to calculate travel time');
  }

  const roundTripHours = travelTime.durationHours * 2;
  const adjustedTransportHours = roundTripHours * transportRate;

  return {
    distanceMiles: travelTime.distanceMiles,
    oneWayMinutes: travelTime.durationMinutes,
    roundTripHours,
    adjustedTransportHours,
    transportRate,
  };
}

// ============================================================================
// STATIC MAPS API
// ============================================================================

export interface StaticMapParams {
  center: string | { lat: number; lng: number };
  zoom?: number; // Default 18 for property view
  size?: { width: number; height: number }; // Default 600x400
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'; // Default satellite
  markers?: Array<{
    location: string | { lat: number; lng: number };
    color?: string;
    label?: string;
  }>;
}

export function getStaticMapUrl(params: StaticMapParams): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  const {
    center,
    zoom = 18,
    size = { width: 600, height: 400 },
    mapType = 'satellite',
    markers = [],
  } = params;

  const centerStr = typeof center === 'string'
    ? center
    : `${center.lat},${center.lng}`;

  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
  url.searchParams.append('center', centerStr);
  url.searchParams.append('zoom', zoom.toString());
  url.searchParams.append('size', `${size.width}x${size.height}`);
  url.searchParams.append('maptype', mapType);
  url.searchParams.append('key', apiKey);

  // Add markers
  markers.forEach(marker => {
    const location = typeof marker.location === 'string'
      ? marker.location
      : `${marker.location.lat},${marker.location.lng}`;

    let markerStr = '';
    if (marker.color) markerStr += `color:${marker.color}|`;
    if (marker.label) markerStr += `label:${marker.label}|`;
    markerStr += location;

    url.searchParams.append('markers', markerStr);
  });

  return url.toString();
}

/**
 * Get a satellite view of a property for quote/proposal
 */
export function getPropertySatelliteImage(address: string | { lat: number; lng: number }): string {
  return getStaticMapUrl({
    center: address,
    zoom: 18,
    size: { width: 800, height: 600 },
    mapType: 'satellite',
  });
}

// ============================================================================
// GEOCODING API
// ============================================================================

export interface GeocodeResult {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: string;
  formattedAddress: string;
  addressComponents: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', address);
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.results[0]) {
      return null;
    }

    const result = data.results[0];
    const location = result.geometry.location;

    // Parse address components
    const components: GeocodeResult['addressComponents'] = {};
    result.address_components.forEach((component: any) => {
      if (component.types.includes('street_number') || component.types.includes('route')) {
        components.street = (components.street || '') + ' ' + component.long_name;
      }
      if (component.types.includes('locality')) {
        components.city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        components.state = component.short_name;
      }
      if (component.types.includes('postal_code')) {
        components.zipCode = component.long_name;
      }
      if (component.types.includes('country')) {
        components.country = component.long_name;
      }
    });

    return {
      address,
      coordinates: {
        lat: location.lat,
        lng: location.lng,
      },
      placeId: result.place_id,
      formattedAddress: result.formatted_address,
      addressComponents: components,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('latlng', `${lat},${lng}`);
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.results[0]) {
      return null;
    }

    const result = data.results[0];

    // Parse address components (same as above)
    const components: GeocodeResult['addressComponents'] = {};
    result.address_components.forEach((component: any) => {
      if (component.types.includes('street_number') || component.types.includes('route')) {
        components.street = (components.street || '') + ' ' + component.long_name;
      }
      if (component.types.includes('locality')) {
        components.city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        components.state = component.short_name;
      }
      if (component.types.includes('postal_code')) {
        components.zipCode = component.long_name;
      }
      if (component.types.includes('country')) {
        components.country = component.long_name;
      }
    });

    return {
      address: result.formatted_address,
      coordinates: { lat, lng },
      placeId: result.place_id,
      formattedAddress: result.formatted_address,
      addressComponents: components,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// ============================================================================
// COMPANY BASE LOCATION
// ============================================================================

/**
 * Default company location (New Smyrna Beach, FL)
 * Update this in your environment or company settings
 */
export const DEFAULT_COMPANY_LOCATION = {
  address: 'New Smyrna Beach, FL',
  coordinates: {
    lat: 29.0258,
    lng: -80.9270,
  },
};

/**
 * Calculate transport from company base to job site
 */
export async function calculateTransportFromBase(
  jobSiteAddress: string | { lat: number; lng: number }
): Promise<TransportCostResult> {
  return calculateTransportCost({
    origin: DEFAULT_COMPANY_LOCATION.coordinates,
    destination: jobSiteAddress,
  });
}
