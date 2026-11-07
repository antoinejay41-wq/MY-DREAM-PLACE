import { Property } from '../types';

export interface CityGeoReference {
  city: string;
  province: string;
  country: string;
  lat: number;
  lng: number;
  defaultAccuracy: 'approximate' | 'exact';
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

/**
 * Verified geographic references for supported cities and regions.
 * For Cap Cana, uses the required approximate geographic reference:
 * Latitude: 18.5000, Longitude: -68.3895
 */
export const VERIFIED_CITY_REFERENCES: CityGeoReference[] = [
  {
    city: 'Cap Cana',
    province: 'La Altagracia',
    country: 'Dominican Republic',
    lat: 18.5000,
    lng: -68.3895,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 18.42, maxLat: 18.55, minLng: -68.47, maxLng: -68.33 }
  },
  {
    city: 'Punta Cana',
    province: 'La Altagracia',
    country: 'Dominican Republic',
    lat: 18.5601,
    lng: -68.3725,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 18.48, maxLat: 18.75, minLng: -68.52, maxLng: -68.31 }
  },
  {
    city: 'Santo Domingo',
    province: 'Distrito Nacional',
    country: 'Dominican Republic',
    lat: 18.4725,
    lng: -69.9398,
    defaultAccuracy: 'exact',
    bounds: { minLat: 18.40, maxLat: 18.58, minLng: -70.08, maxLng: -69.75 }
  },
  {
    city: 'La Romana',
    province: 'La Romana',
    country: 'Dominican Republic',
    lat: 18.4156,
    lng: -68.8892,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 18.36, maxLat: 18.50, minLng: -69.02, maxLng: -68.82 }
  },
  {
    city: 'Las Terrenas',
    province: 'Samaná',
    country: 'Dominican Republic',
    lat: 19.3142,
    lng: -69.5618,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 19.24, maxLat: 19.36, minLng: -69.65, maxLng: -69.46 }
  },
  {
    city: 'Samaná',
    province: 'Samaná',
    country: 'Dominican Republic',
    lat: 19.2891,
    lng: -69.2014,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 19.15, maxLat: 19.36, minLng: -69.45, maxLng: -69.12 }
  },
  {
    city: 'Port-au-Prince',
    province: 'Ouest',
    country: 'Haiti',
    lat: 18.5392,
    lng: -72.3364,
    defaultAccuracy: 'exact',
    bounds: { minLat: 18.48, maxLat: 18.63, minLng: -72.42, maxLng: -72.26 }
  },
  {
    city: 'Pétion-Ville',
    province: 'Ouest',
    country: 'Haiti',
    lat: 18.5125,
    lng: -72.2853,
    defaultAccuracy: 'exact',
    bounds: { minLat: 18.46, maxLat: 18.55, minLng: -72.34, maxLng: -72.23 }
  },
  {
    city: 'Kenscoff',
    province: 'Ouest',
    country: 'Haiti',
    lat: 18.4506,
    lng: -72.2839,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 18.40, maxLat: 18.49, minLng: -72.34, maxLng: -72.22 }
  },
  {
    city: 'Cap-Haïtien',
    province: 'Nord',
    country: 'Haiti',
    lat: 19.7579,
    lng: -72.2042,
    defaultAccuracy: 'exact',
    bounds: { minLat: 19.68, maxLat: 19.82, minLng: -72.30, maxLng: -72.14 }
  },
  {
    city: 'Jacmel',
    province: 'Sud-Est',
    country: 'Haiti',
    lat: 18.2342,
    lng: -72.5347,
    defaultAccuracy: 'approximate',
    bounds: { minLat: 18.18, maxLat: 18.30, minLng: -72.62, maxLng: -72.45 }
  },
  {
    city: 'Miami Beach',
    province: 'Florida',
    country: 'United States',
    lat: 25.7907,
    lng: -80.1628,
    defaultAccuracy: 'exact',
    bounds: { minLat: 25.65, maxLat: 25.95, minLng: -80.32, maxLng: -80.10 }
  }
];

const COUNTRY_BOUNDS: Record<
  string,
  { minLat: number; maxLat: number; minLng: number; maxLng: number }
> = {
  'dominican republic': {
    minLat: 17.45,
    maxLat: 20.05,
    minLng: -71.95,
    maxLng: -68.25
  },
  haiti: {
    minLat: 18.0,
    maxLat: 20.15,
    minLng: -74.55,
    maxLng: -71.65
  },
  'united states': {
    minLat: 24.3,
    maxLat: 49.5,
    minLng: -125.0,
    maxLng: -66.5
  }
};

export interface LocationValidationResult {
  isValid: boolean;
  hasCoordinates: boolean;
  needsAdminReview: boolean;
  coordinates: { lat: number; lng: number } | null;
  accuracy: 'approximate' | 'exact' | 'unavailable';
  statusLabel: string;
  reason?: string;
}

export function findCityReference(
  city?: string,
  country?: string
): CityGeoReference | undefined {
  if (!city) return undefined;
  const normCity = city.trim().toLowerCase();
  const normCountry = country?.trim().toLowerCase();

  return VERIFIED_CITY_REFERENCES.find((ref) => {
    const cityMatch = ref.city.toLowerCase() === normCity;
    if (!normCountry) return cityMatch;
    return cityMatch && ref.country.toLowerCase() === normCountry;
  });
}

/**
 * Validates a property's coordinates against its declared country, province, and city.
 * Never silently replaces missing or invalid coordinates with an unrelated fallback (such as Port-au-Prince).
 */
export function validatePropertyLocation(
  location: Property['location']
): LocationValidationResult {
  const coords = location.coordinates;
  const hasRawCoords =
    coords !== null &&
    coords !== undefined &&
    typeof coords.lat === 'number' &&
    typeof coords.lng === 'number' &&
    Number.isFinite(coords.lat) &&
    Number.isFinite(coords.lng) &&
    !(coords.lat === 0 && coords.lng === 0);

  if (!hasRawCoords || !coords) {
    return {
      isValid: false,
      hasCoordinates: false,
      needsAdminReview: true,
      coordinates: null,
      accuracy: 'unavailable',
      statusLabel: 'Location Not Available (Approximate Area Only)',
      reason: 'Missing or unset latitude/longitude coordinates.'
    };
  }

  const { lat, lng } = coords;

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      isValid: false,
      hasCoordinates: true,
      needsAdminReview: true,
      coordinates: null,
      accuracy: 'unavailable',
      statusLabel: 'Invalid Coordinates — Flagged for Admin Review',
      reason: `Latitude (${lat}) or Longitude (${lng}) is out of global geographic range.`
    };
  }

  const normCountry = (location.country || '').trim().toLowerCase();
  const countryBox = COUNTRY_BOUNDS[normCountry];

  if (countryBox) {
    const insideCountry =
      lat >= countryBox.minLat &&
      lat <= countryBox.maxLat &&
      lng >= countryBox.minLng &&
      lng <= countryBox.maxLng;

    if (!insideCountry) {
      const detectedInHaiti =
        lat >= COUNTRY_BOUNDS.haiti.minLat &&
        lat <= COUNTRY_BOUNDS.haiti.maxLat &&
        lng >= COUNTRY_BOUNDS.haiti.minLng &&
        lng <= COUNTRY_BOUNDS.haiti.maxLng;

      const reasonMsg =
        normCountry === 'dominican republic' && detectedInHaiti
          ? `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) point to Haiti instead of Dominican Republic.`
          : `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) do not match declared country (${location.country}).`;

      return {
        isValid: false,
        hasCoordinates: true,
        needsAdminReview: true,
        coordinates: null,
        accuracy: 'unavailable',
        statusLabel: 'Inconsistent Country Coordinates — Admin Review Required',
        reason: reasonMsg
      };
    }
  }

  const cityRef = findCityReference(location.city, location.country);
  if (cityRef) {
    const { minLat, maxLat, minLng, maxLng } = cityRef.bounds;
    const insideCityRegion =
      lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;

    if (!insideCityRegion) {
      return {
        isValid: false,
        hasCoordinates: true,
        needsAdminReview: true,
        coordinates: null,
        accuracy: 'unavailable',
        statusLabel: 'Inconsistent City Coordinates — Admin Review Required',
        reason: `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) fall outside expected ${cityRef.city}, ${cityRef.province} region.`
      };
    }
  }

  const isCapCana = location.city.trim().toLowerCase() === 'cap cana';
  const effectiveAccuracy: 'approximate' | 'exact' = isCapCana
    ? 'approximate'
    : location.locationAccuracy || cityRef?.defaultAccuracy || 'approximate';

  return {
    isValid: true,
    hasCoordinates: true,
    needsAdminReview: false,
    coordinates: { lat, lng },
    accuracy: effectiveAccuracy,
    statusLabel:
      effectiveAccuracy === 'approximate'
        ? `Approximate ${location.city} Area Reference`
        : `Verified ${location.city} Property Coordinates`
  };
}

/**
 * Builds the external Google Maps URL for a property ("View Location").
 * Uses verified property coordinates when valid:
 *   https://www.google.com/maps/search/?api=1&query=${lat},${lng}
 * Otherwise falls back to a properly encoded query containing neighborhood, city, province, and country.
 * Never uses a default Haiti location for properties in the Dominican Republic.
 */
export function buildGoogleMapsLocationUrl(
  location: Property['location']
): string {
  const validation = validatePropertyLocation(location);

  if (validation.isValid && validation.coordinates) {
    const { lat, lng } = validation.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const queryParts = [
    location.neighborhood,
    location.city,
    location.province,
    location.country
  ]
    .map((part) => (part || '').trim())
    .filter(Boolean);

  const encodedQuery = encodeURIComponent(
    queryParts.length > 0 ? queryParts.join(', ') : 'Caribbean Real Estate'
  );
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

/**
 * Formats the full human-readable location line including neighborhood, city, province/state, and country.
 */
export function formatPropertyLocationLine(
  location: Property['location'],
  includeAddress = false
): string {
  const parts = [
    includeAddress && location.address ? location.address : '',
    location.neighborhood,
    location.city,
    location.province,
    location.country
  ]
    .map((p) => (p || '').trim())
    .filter(Boolean);

  return parts.join(', ');
}
