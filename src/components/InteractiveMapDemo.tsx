import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  ExternalLink,
  Layers,
  LocateFixed,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Search,
  ShieldAlert,
  X
} from 'lucide-react';
import { Property } from '../types';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { translatePropertyText } from '../translations';
import { PropertyImage } from './PropertyImage';
import {
  GMP_ATTRIBUTION_ID,
  GMP_MAP_ID,
  checkAndTriggerQuotaError,
  getGoogleMapsApiKey,
  triggerMapsQuotaExceeded
} from '../utils/googleMapsConfig';
import {
  VERIFIED_CITY_REFERENCES,
  buildGoogleMapsLocationUrl,
  findCityReference,
  formatPropertyLocationLine,
  validatePropertyLocation
} from '../utils/locationUtils';

interface InteractiveMapDemoProps {
  properties: Property[];
  selectedPropertyId?: string;
  heightClass?: string;
}

interface SearchedPlacePin {
  name: string;
  address: string;
  location: google.maps.LatLngLiteral;
}

const COUNTRY_LANDMARK_ORIGINS: Record<
  string,
  { label: string; location: google.maps.LatLngLiteral }[]
> = {
  'Dominican Republic': [
    {
      label: 'Punta Cana Intl Airport (PUJ)',
      location: { lat: 18.5674, lng: -68.3634 }
    },
    {
      label: 'Cap Cana Marina Reference',
      location: { lat: 18.5000, lng: -68.3895 }
    },
    {
      label: 'Santo Domingo — Piantini Center',
      location: { lat: 18.4725, lng: -69.9398 }
    },
    {
      label: 'Las Américas Intl Airport (SDQ)',
      location: { lat: 18.4297, lng: -69.6689 }
    }
  ],
  Haiti: [
    {
      label: 'Port-au-Prince Intl Airport (PAP)',
      location: { lat: 18.58, lng: -72.2925 }
    },
    {
      label: 'Port-au-Prince — Bourdon',
      location: { lat: 18.5392, lng: -72.3364 }
    },
    {
      label: 'Pétion-Ville Central Square',
      location: { lat: 18.5125, lng: -72.2853 }
    },
    {
      label: 'Cap-Haïtien Historic Center',
      location: { lat: 19.7579, lng: -72.2042 }
    }
  ],
  'United States': [
    {
      label: 'Miami Intl Airport (MIA)',
      location: { lat: 25.7959, lng: -80.287 }
    },
    {
      label: 'Miami Beach — South Pointe',
      location: { lat: 25.7682, lng: -80.1341 }
    }
  ]
};

/**
 * Inner controller component rendered inside <GoogleMap> to handle:
 * 1. Places API (New) AutocompleteSuggestion.fetchAutocompleteSuggestions + sessionToken
 * 2. Routes API Route.computeRoutes (Zero-Legacy replacement for DirectionsService)
 * 3. Camera synchronization when selected property or manual city changes
 */
const GoogleMapInnerController: React.FC<{
  activeProperty?: Property;
  searchedPlace: SearchedPlacePin | null;
  visitorGps: google.maps.LatLngLiteral | null;
  manualViewportTarget: { lat: number; lng: number; zoom?: number } | null;
  onSelectPlace: (place: SearchedPlacePin | null) => void;
}> = ({
  activeProperty,
  searchedPlace,
  visitorGps,
  manualViewportTarget,
  onSelectPlace
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedOriginIdx, setSelectedOriginIdx] = useState<number>(0);
  const [useVisitorGpsForRoute, setUseVisitorGpsForRoute] = useState(false);
  const [routeSummary, setRouteSummary] = useState<{
    distanceText: string;
    durationText: string;
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const countryOrigins = useMemo(() => {
    const country = activeProperty?.location.country || 'Dominican Republic';
    return (
      COUNTRY_LANDMARK_ORIGINS[country] ||
      COUNTRY_LANDMARK_ORIGINS['Dominican Republic']
    );
  }, [activeProperty?.location.country]);

  // Reset origin index when country changes
  useEffect(() => {
    setSelectedOriginIdx(0);
  }, [activeProperty?.location.country]);

  const clearRoutePolylines = useCallback(() => {
    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];
    setRouteSummary(null);
    setRouteError(null);
  }, []);

  // Pan map when activeProperty changes (only using verified coordinates or verified city reference)
  useEffect(() => {
    if (!map || !activeProperty) return;
    clearRoutePolylines();
    const validation = validatePropertyLocation(activeProperty.location);
    if (validation.isValid && validation.coordinates) {
      map.panTo(validation.coordinates);
      map.setZoom(13);
    } else {
      const cityRef = findCityReference(
        activeProperty.location.city,
        activeProperty.location.country
      );
      if (cityRef) {
        map.panTo({ lat: cityRef.lat, lng: cityRef.lng });
        map.setZoom(12);
      }
    }
  }, [map, activeProperty, clearRoutePolylines]);

  // Pan map when manualViewportTarget changes (e.g. Visitor GPS or manual city selection)
  useEffect(() => {
    if (!map || !manualViewportTarget) return;
    map.panTo({
      lat: manualViewportTarget.lat,
      lng: manualViewportTarget.lng
    });
    if (manualViewportTarget.zoom) {
      map.setZoom(manualViewportTarget.zoom);
    }
  }, [map, manualViewportTarget]);

  // Cleanup polylines on unmount
  useEffect(() => {
    return () => {
      polylinesRef.current.forEach((line) => line.setMap(null));
      polylinesRef.current = [];
    };
  }, []);

  // Places API (New): AutocompleteSuggestion.fetchAutocompleteSuggestions with sessionToken
  useEffect(() => {
    if (!placesLib) return;
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }

        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: trimmed,
            sessionToken: sessionTokenRef.current
          });

        setSuggestions(response?.suggestions ?? []);
      } catch (err) {
        checkAndTriggerQuotaError(err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [placesLib, searchQuery]);

  const handleSuggestionSelect = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;
      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location', 'viewport']
        });

        sessionTokenRef.current = null;
        setSuggestions([]);
        setSearchQuery('');

        if (place.location) {
          const lat = place.location.lat();
          const lng = place.location.lng();
          const pin: SearchedPlacePin = {
            name: place.displayName || suggestion.placePrediction.text.text,
            address: place.formattedAddress || '',
            location: { lat, lng }
          };
          onSelectPlace(pin);

          if (map) {
            if (place.viewport) {
              map.fitBounds(place.viewport);
            } else {
              map.panTo({ lat, lng });
              map.setZoom(15);
            }
          }
        }
      } catch (err) {
        checkAndTriggerQuotaError(err);
      }
    },
    [placesLib, map, onSelectPlace]
  );

  // Modern Routes API: Route.computeRoutes
  const handleCalculateRoute = useCallback(async () => {
    if (!routesLib || !map || !activeProperty) return;

    const validation = validatePropertyLocation(activeProperty.location);
    if (!validation.isValid || !validation.coordinates) {
      setRouteError(
        'Cannot compute driving route: this listing does not have verified coordinates.'
      );
      return;
    }

    const originLocation =
      useVisitorGpsForRoute && visitorGps
        ? visitorGps
        : searchedPlace
        ? searchedPlace.location
        : countryOrigins[selectedOriginIdx]?.location ||
          countryOrigins[0].location;

    const destLocation = validation.coordinates;

    clearRoutePolylines();
    setRouteLoading(true);
    setRouteError(null);

    try {
      const RouteClass = (
        routesLib as unknown as {
          Route: {
            computeRoutes: (req: unknown) => Promise<{
              routes?: Array<{
                distanceMeters?: number;
                durationMillis?: number;
                createPolylines?: () => google.maps.Polyline[];
                bounds?: google.maps.LatLngBounds;
              }>;
            }>;
          };
        }
      ).Route;

      if (!RouteClass || typeof RouteClass.computeRoutes !== 'function') {
        setRouteError('Routes service unavailable in this browser session.');
        return;
      }

      const response = await RouteClass.computeRoutes({
        origin: originLocation,
        destination: destLocation,
        travelMode: 'DRIVING',
        fields: ['path', 'distanceMeters', 'durationMillis', 'viewport']
      });

      const primaryRoute = response?.routes?.[0];
      if (!primaryRoute) {
        setRouteError(
          'No overland driving route available between these locations.'
        );
        return;
      }

      if (typeof primaryRoute.createPolylines === 'function') {
        const lines = primaryRoute.createPolylines();
        lines.forEach((line) => {
          line.setOptions({
            strokeColor: '#1150EF',
            strokeOpacity: 0.9,
            strokeWeight: 5
          });
          line.setMap(map);
        });
        polylinesRef.current = lines;
      }

      if (primaryRoute.bounds) {
        map.fitBounds(primaryRoute.bounds, 48);
      }

      const km = primaryRoute.distanceMeters
        ? `${(primaryRoute.distanceMeters / 1000).toFixed(1)} km`
        : '—';
      const mins = primaryRoute.durationMillis
        ? `${Math.max(1, Math.round(primaryRoute.durationMillis / 60000))} min drive`
        : '—';

      setRouteSummary({ distanceText: km, durationText: mins });
    } catch (err) {
      if (!checkAndTriggerQuotaError(err)) {
        setRouteError('Could not compute route for this location.');
      }
    } finally {
      setRouteLoading(false);
    }
  }, [
    routesLib,
    map,
    activeProperty,
    useVisitorGpsForRoute,
    visitorGps,
    searchedPlace,
    countryOrigins,
    selectedOriginIdx,
    clearRoutePolylines
  ]);

  return (
    <div className="absolute top-14 left-3 right-3 sm:right-auto sm:w-[360px] z-20 space-y-2 pointer-events-none">
      {/* Places API (New) Search Box */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-neutral-200/90 p-2">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#1150EF] ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or place on Google Maps..."
            className="w-full h-8 px-2.5 text-xs font-body text-[#161616] bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
              className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="mt-1.5 border-t border-neutral-100 pt-1 max-h-48 overflow-y-auto divide-y divide-neutral-100">
            {suggestions.map((s, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleSuggestionSelect(s)}
                  className="w-full text-left px-2.5 py-2 text-xs font-body text-[#161616] hover:bg-blue-50/70 rounded-lg flex items-start gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1150EF] shrink-0 mt-0.5" />
                  <span className="truncate">
                    {s.placePrediction?.text?.text || 'Selected Location'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {isSearching && (
          <div className="px-2.5 py-1 text-[11px] font-ui text-[#737373]">
            Searching Google Places...
          </div>
        )}

        {/* Quick Route & Travel Time Bar to Active Property */}
        {activeProperty && (
          <div className="mt-2 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-1.5">
            {visitorGps && (
              <label className="w-full flex items-center gap-1.5 text-[11px] font-ui text-emerald-800 font-semibold cursor-pointer mb-0.5">
                <input
                  type="checkbox"
                  checked={useVisitorGpsForRoute}
                  onChange={(e) => setUseVisitorGpsForRoute(e.target.checked)}
                  className="accent-emerald-600"
                />
                <span>Route from my current GPS position</span>
              </label>
            )}

            {!useVisitorGpsForRoute && !searchedPlace ? (
              <select
                value={selectedOriginIdx}
                onChange={(e) => setSelectedOriginIdx(Number(e.target.value))}
                aria-label="Route origin landmark"
                className="flex-1 min-w-0 h-7 px-2 rounded-lg bg-neutral-100 text-[11px] font-ui text-[#161616]"
              >
                {countryOrigins.map((item, index) => (
                  <option key={item.label} value={index}>
                    From: {item.label}
                  </option>
                ))}
              </select>
            ) : !useVisitorGpsForRoute && searchedPlace ? (
              <div className="flex-1 min-w-0 text-[11px] font-ui text-[#1150EF] font-semibold truncate flex items-center gap-1">
                <span>From: {searchedPlace.name}</span>
                <button
                  type="button"
                  onClick={() => onSelectPlace(null)}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  title="Clear custom origin"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex-1 min-w-0 text-[11px] font-ui text-emerald-700 font-semibold truncate">
                From: Your Visitor GPS Location
              </div>
            )}

            <button
              type="button"
              onClick={handleCalculateRoute}
              disabled={routeLoading}
              className="px-2.5 h-7 rounded-lg bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Navigation className="w-3 h-3" />
              <span>{routeLoading ? 'Routing...' : 'Route'}</span>
            </button>

            {routeSummary && (
              <button
                type="button"
                onClick={clearRoutePolylines}
                className="px-2 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-ui text-[11px] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {routeSummary && (
          <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50/90 text-[#1150EF] font-ui text-[11px] font-bold flex items-center justify-between">
            <span>Driving to {activeProperty?.referenceCode}:</span>
            <span>
              {routeSummary.distanceText} · {routeSummary.durationText}
            </span>
          </div>
        )}

        {routeError && (
          <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-ui text-[11px]">
            {routeError}
          </div>
        )}
      </div>
    </div>
  );
};

export const InteractiveMapDemo: React.FC<InteractiveMapDemoProps> = ({
  properties,
  selectedPropertyId,
  heightClass = 'h-[460px]'
}) => {
  const { t, language, formatPrice } = useMarketplace();
  const [activeId, setActiveId] = useState<string | undefined>(
    selectedPropertyId || properties[0]?.id
  );
  const [expanded, setExpanded] = useState(false);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [searchedPlace, setSearchedPlace] = useState<SearchedPlacePin | null>(
    null
  );

  // Task 5: Separate Visitor Current Location state (never confused with property coordinates)
  const [visitorGps, setVisitorGps] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [visitorLocating, setVisitorLocating] = useState(false);
  const [visitorGeoError, setVisitorGeoError] = useState<string | null>(null);
  const [manualViewportTarget, setManualViewportTarget] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(null);

  const apiKey = getGoogleMapsApiKey();
  const apiLoadingStatus = useApiLoadingStatus();

  useEffect(() => {
    if (selectedPropertyId) {
      setActiveId(selectedPropertyId);
      setInfoWindowOpen(true);
    } else if (
      properties.length > 0 &&
      !properties.some((p) => p.id === activeId)
    ) {
      setActiveId(properties[0].id);
    }
  }, [selectedPropertyId, properties, activeId]);

  useEffect(() => {
    if (apiLoadingStatus === APILoadingStatus.AUTH_FAILURE) {
      triggerMapsQuotaExceeded();
    }
  }, [apiLoadingStatus]);

  const activeProperty = useMemo(
    () => properties.find((p) => p.id === activeId) || properties[0],
    [properties, activeId]
  );

  const activeValidation = useMemo(
    () =>
      activeProperty
        ? validatePropertyLocation(activeProperty.location)
        : null,
    [activeProperty]
  );

  // Filter properties with valid verified coordinates for map markers (Task 3)
  const validatedPropertyEntries = useMemo(
    () =>
      properties.map((prop) => ({
        property: prop,
        validation: validatePropertyLocation(prop.location)
      })),
    [properties]
  );

  const localizedActiveProperty = activeProperty
    ? translatePropertyText(activeProperty.id, language, {
        title: activeProperty.title,
        subtitle: activeProperty.subtitle,
        description: activeProperty.description
      })
    : null;

  // Never fall back to Port-au-Prince for unrelated properties (Task 1)
  const defaultCenter = useMemo(() => {
    if (activeValidation?.isValid && activeValidation.coordinates) {
      return activeValidation.coordinates;
    }
    if (activeProperty) {
      const cityRef = findCityReference(
        activeProperty.location.city,
        activeProperty.location.country
      );
      if (cityRef) {
        return { lat: cityRef.lat, lng: cityRef.lng };
      }
    }
    const firstValid = validatedPropertyEntries.find(
      (entry) => entry.validation.isValid && entry.validation.coordinates
    );
    if (firstValid?.validation.coordinates) {
      return firstValid.validation.coordinates;
    }
    // Neutral Hispaniola / Caribbean regional overview center
    return { lat: 18.65, lng: -70.15 };
  }, [activeValidation, activeProperty, validatedPropertyEntries]);

  const canRenderGoogleMap =
    Boolean(apiKey) &&
    apiLoadingStatus !== APILoadingStatus.AUTH_FAILURE &&
    apiLoadingStatus !== APILoadingStatus.FAILED;

  // Task 5: Request visitor current location ONLY on button click
  const handleUseMyLocation = () => {
    setVisitorGeoError(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setVisitorGeoError(
        'Geolocation is not supported by your browser. Please select a city manually below.'
      );
      return;
    }

    setVisitorLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: Number(position.coords.latitude.toFixed(5)),
          lng: Number(position.coords.longitude.toFixed(5))
        };
        setVisitorGps(coords);
        setManualViewportTarget({ ...coords, zoom: 13 });
        setVisitorLocating(false);
      },
      () => {
        setVisitorLocating(false);
        setVisitorGeoError(
          'Location permission was denied or unavailable. You can select a city manually below:'
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Manual city selection handler (when visitor wants to jump to a specific city or after denying GPS)
  const handleManualCitySelect = (cityName: string, countryName?: string) => {
    const matchingProp = properties.find(
      (p) =>
        p.location.city.toLowerCase() === cityName.toLowerCase() &&
        (!countryName ||
          p.location.country.toLowerCase() === countryName.toLowerCase())
    );
    if (matchingProp) {
      setActiveId(matchingProp.id);
      setInfoWindowOpen(true);
    }
    const ref = findCityReference(cityName, countryName);
    if (ref) {
      setManualViewportTarget({ lat: ref.lat, lng: ref.lng, zoom: 13 });
    }
  };

  // Deterministic normalized map position inside the fallback architectural SVG canvas
  const getPinPosition = (prop: Property, idx: number) => {
    const coords = prop.location.coordinates;
    const lat = coords?.lat ?? 18.5;
    const lng = coords?.lng ?? -69.9;
    const normX = ((Math.abs(lng * 100) + idx * 19) % 76) + 12;
    const normY = ((Math.abs(lat * 100) + idx * 23) % 68) + 16;
    return { left: `${normX}%`, top: `${normY}%` };
  };

  const activeMapsUrl = activeProperty
    ? buildGoogleMapsLocationUrl(activeProperty.location)
    : 'https://www.google.com/maps';

  return (
    <div className="space-y-2.5">
      {/* Quick City / Property Verification & Visitor Location Bar (Tasks 5 & 6) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-neutral-200/90 text-xs font-ui">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] mr-1">
            Regions:
          </span>
          {[
            { city: 'Cap Cana', country: 'Dominican Republic', label: 'Cap Cana, DR' },
            { city: 'Punta Cana', country: 'Dominican Republic', label: 'Punta Cana, DR' },
            { city: 'Santo Domingo', country: 'Dominican Republic', label: 'Santo Domingo, DR' },
            { city: 'Port-au-Prince', country: 'Haiti', label: 'Port-au-Prince, HT' },
            { city: 'Pétion-Ville', country: 'Haiti', label: 'Pétion-Ville, HT' },
            { city: 'Cap-Haïtien', country: 'Haiti', label: 'Cap-Haïtien, HT' }
          ].map((regionItem) => {
            const isActiveCity =
              activeProperty?.location.city.toLowerCase() ===
              regionItem.city.toLowerCase();
            return (
              <button
                key={regionItem.label}
                type="button"
                onClick={() =>
                  handleManualCitySelect(regionItem.city, regionItem.country)
                }
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  isActiveCity
                    ? 'bg-[#1150EF] text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-[#161616]'
                }`}
              >
                {regionItem.label}
              </button>
            );
          })}
        </div>

        {/* Task 5: Separate "Use My Location" Visitor GPS Button */}
        <div className="flex items-center gap-2 ml-auto">
          {visitorGps && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold inline-flex items-center gap-1">
              <LocateFixed className="w-3 h-3 text-emerald-600" />
              <span>
                Visitor GPS: {visitorGps.lat.toFixed(3)}, {visitorGps.lng.toFixed(3)}
              </span>
              <button
                type="button"
                onClick={() => setVisitorGps(null)}
                className="ml-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
                title="Clear visitor GPS pin"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={visitorLocating}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Center map on your personal GPS position (separate from property locations)"
          >
            <LocateFixed className="w-3.5 h-3.5 text-[#76A2FA]" />
            <span>{visitorLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>
        </div>
      </div>

      {/* Helpful Fallback Message + Manual City Selector if Geolocation Permission is Denied (Task 5) */}
      {visitorGeoError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-ui flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{visitorGeoError}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {VERIFIED_CITY_REFERENCES.slice(0, 5).map((ref) => (
              <button
                key={ref.city}
                type="button"
                onClick={() => {
                  handleManualCitySelect(ref.city, ref.country);
                  setVisitorGeoError(null);
                }}
                className="px-2.5 py-1 rounded-md bg-white border border-amber-300 hover:border-[#1150EF] text-[#0D0D0D] font-semibold cursor-pointer"
              >
                {ref.city}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setVisitorGeoError(null)}
              className="p-1 text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-neutral-200 bg-[#0d1f49] shadow-sm transition-all ${
          expanded ? 'h-[620px]' : heightClass
        }`}
      >
        {/* Top Map Control Bar */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[#161616] shadow-md text-xs font-ui font-medium border border-neutral-200/80">
            <Compass className="w-4 h-4 text-[#1150EF] shrink-0" />
            <span>
              {activeProperty
                ? `${activeProperty.location.city}${
                    activeProperty.location.province
                      ? `, ${activeProperty.location.province}`
                      : ''
                  } · ${activeProperty.location.country}`
                : t.property.mapDemoNotice}
            </span>
            {activeValidation && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  !activeValidation.isValid
                    ? 'bg-amber-100 text-amber-900'
                    : activeValidation.accuracy === 'approximate'
                    ? 'bg-blue-50 text-[#1150EF]'
                    : 'bg-emerald-50 text-emerald-800'
                }`}
              >
                {!activeValidation.isValid
                  ? 'Location Not Available'
                  : activeValidation.accuracy === 'approximate'
                  ? 'Approximate Area'
                  : 'Verified Pin'}
              </span>
            )}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {canRenderGoogleMap && (
              <button
                type="button"
                onClick={() =>
                  setMapTypeId((prev) =>
                    prev === 'roadmap' ? 'hybrid' : 'roadmap'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#161616] shadow-md text-xs font-ui font-semibold cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#1150EF]" />
                <span>{mapTypeId === 'roadmap' ? 'Satellite' : 'Map'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#161616] shadow-md text-xs font-ui font-semibold cursor-pointer"
            >
              {expanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{t.catalog.compactMap}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{t.catalog.expandMap}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {canRenderGoogleMap ? (
          /* Live Google Maps Platform View (@vis.gl/react-google-maps) */
          <div className="w-full h-full">
            <GoogleMap
              mapId={GMP_MAP_ID}
              defaultCenter={defaultCenter}
              defaultZoom={selectedPropertyId ? 13 : 11}
              mapTypeId={mapTypeId}
              gestureHandling="greedy"
              disableDefaultUI={false}
              streetViewControl={true}
              mapTypeControl={false}
              fullscreenControl={false}
              internalUsageAttributionIds={[GMP_ATTRIBUTION_ID]}
              style={{ width: '100%', height: '100%' }}
            >
              <GoogleMapInnerController
                activeProperty={activeProperty}
                searchedPlace={searchedPlace}
                visitorGps={visitorGps}
                manualViewportTarget={manualViewportTarget}
                onSelectPlace={setSearchedPlace}
              />

              {/* Task 5: Distinct Visitor GPS Marker (Never confused with a property marker) */}
              {visitorGps && (
                <AdvancedMarker
                  position={visitorGps}
                  title="Your Current Visitor GPS Position"
                  zIndex={45}
                >
                  <div className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-ui text-[11px] font-bold shadow-lg border-2 border-white flex items-center gap-1.5">
                    <LocateFixed className="w-3.5 h-3.5 animate-pulse" />
                    <span>Your Current Location</span>
                  </div>
                </AdvancedMarker>
              )}

              {/* Searched Place Marker */}
              {searchedPlace && (
                <AdvancedMarker
                  position={searchedPlace.location}
                  title={searchedPlace.name}
                  zIndex={40}
                >
                  <div className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-ui text-[11px] font-bold shadow-lg border-2 border-white flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{searchedPlace.name}</span>
                  </div>
                </AdvancedMarker>
              )}

              {/* Task 3: Validated Property AdvancedMarkers ONLY */}
              {validatedPropertyEntries.slice(0, 25).map(({ property: prop, validation }) => {
                if (!validation.isValid || !validation.coordinates) {
                  return null;
                }
                const isSelected = activeProperty?.id === prop.id;
                return (
                  <AdvancedMarker
                    key={prop.id}
                    position={validation.coordinates}
                    zIndex={isSelected ? 35 : 10}
                    onClick={() => {
                      setActiveId(prop.id);
                      setInfoWindowOpen(true);
                    }}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-lg font-ui text-xs font-bold tabular-nums transition-all cursor-pointer shadow-md flex items-center gap-1 whitespace-nowrap border ${
                        isSelected
                          ? 'bg-[#1150EF] text-white border-white scale-110 ring-4 ring-[#1150EF]/30'
                          : 'bg-white text-[#0D0D0D] border-neutral-200 hover:bg-[#1150EF] hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{formatPrice(prop.priceUSD)}</span>
                      {validation.accuracy === 'approximate' && (
                        <span
                          className={`text-[9px] font-semibold px-1 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-50 text-[#1150EF]'
                          }`}
                          title="Approximate geographic reference for this area"
                        >
                          ~Area
                        </span>
                      )}
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* InfoWindow for Active Property (when coordinates are valid) */}
              {activeProperty &&
                localizedActiveProperty &&
                activeValidation?.isValid &&
                activeValidation.coordinates &&
                infoWindowOpen && (
                  <InfoWindow
                    position={activeValidation.coordinates}
                    pixelOffset={[0, -34]}
                    maxWidth={300}
                    onCloseClick={() => setInfoWindowOpen(false)}
                  >
                    <div className="p-1 text-[#161616] space-y-1.5">
                      <div className="text-[10px] font-ui font-bold uppercase tracking-wider text-[#1150EF]">
                        {activeProperty.location.neighborhood},{' '}
                        {activeProperty.location.city}
                        {activeProperty.location.province
                          ? `, ${activeProperty.location.province}`
                          : ''}{' '}
                        · {activeProperty.location.country}
                      </div>
                      <div className="font-display text-sm font-semibold text-[#0D0D0D]">
                        {localizedActiveProperty.title}
                      </div>
                      <div className="text-[11px] font-ui text-[#737373]">
                        {activeValidation.accuracy === 'approximate' ? (
                          <span>
                            Approximate area reference (
                            {activeValidation.coordinates.lat.toFixed(4)},{' '}
                            {activeValidation.coordinates.lng.toFixed(4)}) — not exact house pin
                          </span>
                        ) : (
                          <span>
                            Verified coordinates (
                            {activeValidation.coordinates.lat.toFixed(4)},{' '}
                            {activeValidation.coordinates.lng.toFixed(4)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100">
                        <span className="font-ui text-xs font-bold text-[#1150EF]">
                          {formatPrice(
                            activeProperty.priceUSD,
                            activeProperty.priceUnit
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={activeMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-ui font-semibold text-[#1150EF] hover:underline"
                          >
                            <span>View Location</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <Link
                            to={`/property/${activeProperty.id}`}
                            className="inline-flex items-center gap-0.5 text-[11px] font-ui font-semibold text-[#0D0D0D] hover:text-[#1150EF] underline"
                          >
                            <span>{t.sections.viewDetails}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
            </GoogleMap>
          </div>
        ) : (
          /* Architectural SVG Fallback Map when API Key is not yet active */
          <>
            <svg
              viewBox="0 0 1200 700"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            >
              <defs>
                <linearGradient
                  id="oceanGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0b245b" />
                  <stop offset="50%" stopColor="#1150ef" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <pattern
                  id="mapGrid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="1200" height="700" fill="url(#oceanGrad)" />
              <rect width="1200" height="700" fill="url(#mapGrid)" />
              <path
                d="M 80 120 Q 260 60 460 150 T 860 130 Q 1040 160 1120 310 Q 1080 510 860 560 T 410 580 Q 160 520 90 360 Z"
                fill="#eef4ff"
                fillOpacity="0.93"
                stroke="#76a2fa"
                strokeWidth="4"
              />
              <path
                d="M 160 220 Q 340 160 520 230 T 880 250 Q 960 320 840 440 T 380 460 Z"
                fill="#dbeafe"
                fillOpacity="0.65"
              />
              <path
                d="M 120 340 Q 450 280 720 350 T 1060 290"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <path
                d="M 460 140 Q 510 340 590 560"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="2.5"
              />
            </svg>

            <div className="absolute inset-0 z-10">
              {validatedPropertyEntries.slice(0, 14).map(({ property: prop, validation }, idx) => {
                if (!validation.isValid) return null;
                const pos = getPinPosition(prop, idx);
                const isSelected = activeProperty?.id === prop.id;
                return (
                  <button
                    key={prop.id}
                    type="button"
                    style={{ left: pos.left, top: pos.top }}
                    onClick={() => setActiveId(prop.id)}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute px-2.5 py-1 rounded-lg font-ui text-xs font-bold tabular-nums transition-all cursor-pointer shadow-md flex items-center gap-1 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#1150EF] text-white scale-110 z-20 ring-4 ring-[#1150EF]/30'
                        : 'bg-white text-[#0D0D0D] hover:bg-[#1150EF] hover:text-white z-10'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{formatPrice(prop.priceUSD)}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Selected Property Floating Preview Card with Location Validation & View Location Link */}
        {activeProperty && localizedActiveProperty && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-[410px] bg-white/98 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-neutral-200 z-20 flex items-start gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
              <PropertyImage
                src={activeProperty.images[0]}
                alt={localizedActiveProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-[10px] font-ui font-bold uppercase tracking-wider text-[#1150EF] truncate">
                {formatPropertyLocationLine(activeProperty.location)}
              </div>
              <h4 className="font-display text-sm font-semibold text-[#0D0D0D] truncate">
                {localizedActiveProperty.title}
              </h4>

              {/* Task 1 & 3: Coordinate Accuracy / Availability Status */}
              {activeValidation && (
                <div className="text-[11px] font-ui flex items-center gap-1">
                  {activeValidation.isValid && activeValidation.coordinates ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="text-[#737373] truncate">
                        {activeValidation.accuracy === 'approximate'
                          ? `Approx. Area (${activeValidation.coordinates.lat.toFixed(4)}, ${activeValidation.coordinates.lng.toFixed(4)})`
                          : `Exact Pin (${activeValidation.coordinates.lat.toFixed(4)}, ${activeValidation.coordinates.lng.toFixed(4)})`}
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="text-amber-800 font-semibold truncate">
                        {activeValidation.statusLabel}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Task 2: View Location & View Details Actions */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                <span className="font-ui text-xs font-bold text-[#161616] tabular-nums">
                  {formatPrice(activeProperty.priceUSD, activeProperty.priceUnit)}
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href={activeMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-[#1150EF] text-[#1150EF] hover:text-white text-xs font-ui font-semibold transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>View Location</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Link
                    to={`/property/${activeProperty.id}`}
                    className="inline-flex items-center gap-0.5 text-xs font-ui font-semibold text-[#1150EF] hover:underline"
                  >
                    <span>{t.sections.viewDetails}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
