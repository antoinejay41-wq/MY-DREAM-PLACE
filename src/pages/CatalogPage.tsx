import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  Grid,
  List,
  Map as MapIcon,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { EventType, ListingType, PropertyCategory } from '../types';
import { PropertySearchBar } from '../components/PropertySearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { InteractiveMapDemo } from '../components/InteractiveMapDemo';

interface CatalogPageProps {
  mode: ListingType;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ mode }) => {
  const {
    t,
    publicProperties,
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    savedSearches
  } = useMarketplace();
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'split'>('grid');
  const [selectedEventSubType, setSelectedEventSubType] = useState<EventType | 'all'>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');

  // Sync URL query params or page mode on mount / mode change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    setSearchFilters((prev) => ({
      ...prev,
      tab: mode,
      category: urlCategory
        ? urlCategory
        : mode === 'land'
        ? 'land'
        : mode === 'event'
        ? 'event_space'
        : prev.category === 'land' || prev.category === 'event_space'
        ? 'all'
        : prev.category
    }));
  }, [mode, searchParams, setSearchFilters]);

  const filteredProperties = useMemo(() => {
    return publicProperties
      .filter((prop) => {
        // Match primary page mode
        if (prop.listingType !== mode) return false;

        // Category filter
        if (
          searchFilters.category &&
          searchFilters.category !== 'all' &&
          prop.category !== (searchFilters.category as PropertyCategory)
        ) {
          return false;
        }

        // Location filter
        if (searchFilters.location.trim()) {
          const q = searchFilters.location.toLowerCase().trim();
          const locMatch =
            prop.location.city.toLowerCase().includes(q) ||
            prop.location.neighborhood.toLowerCase().includes(q) ||
            prop.location.country.toLowerCase().includes(q) ||
            prop.title.toLowerCase().includes(q);
          if (!locMatch) return false;
        }

        // Price filters
        if (searchFilters.minPrice && prop.priceUSD < Number(searchFilters.minPrice)) {
          return false;
        }
        if (searchFilters.maxPrice && prop.priceUSD > Number(searchFilters.maxPrice)) {
          return false;
        }

        // Bedrooms filter
        if (
          searchFilters.bedrooms &&
          (prop.specs.bedrooms === undefined ||
            prop.specs.bedrooms < Number(searchFilters.bedrooms))
        ) {
          return false;
        }

        // Rental Duration filter (Page 3 — Rent)
        if (
          mode === 'rent' &&
          searchFilters.rentalDuration &&
          searchFilters.rentalDuration !== 'all' &&
          prop.rentalDuration !== searchFilters.rentalDuration
        ) {
          return false;
        }

        // Guest Capacity & Event Type filter (Page 4 — Event Spaces)
        if (mode === 'event') {
          if (
            searchFilters.guestCapacity &&
            (!prop.specs.guestCapacity ||
              prop.specs.guestCapacity < Number(searchFilters.guestCapacity))
          ) {
            return false;
          }
          if (
            selectedEventSubType !== 'all' &&
            !prop.specs.eventTypesSupported?.includes(selectedEventSubType)
          ) {
            return false;
          }
        }

        // Amenity quick filter
        if (
          selectedAmenity !== 'all' &&
          !prop.amenities.some((a) =>
            a.toLowerCase().includes(selectedAmenity.toLowerCase())
          )
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (searchFilters.sortBy === 'price_asc') return a.priceUSD - b.priceUSD;
        if (searchFilters.sortBy === 'price_desc') return b.priceUSD - a.priceUSD;
        if (searchFilters.sortBy === 'area_desc') return b.specs.areaSqm - a.specs.areaSqm;
        if (searchFilters.sortBy === 'newest') {
          return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [publicProperties, mode, searchFilters, selectedEventSubType, selectedAmenity]);

  const pageHeaderInfo = {
    sale: {
      kicker: t.catalog.saleKicker,
      title: t.catalog.saleTitle,
      subtitle: t.catalog.saleSubtitle
    },
    rent: {
      kicker: t.catalog.rentKicker,
      title: t.catalog.rentTitle,
      subtitle: t.catalog.rentSubtitle
    },
    land: {
      kicker: t.catalog.landKicker,
      title: t.catalog.landTitle,
      subtitle: t.catalog.landSubtitle
    },
    event: {
      kicker: t.catalog.eventKicker,
      title: t.catalog.eventTitle,
      subtitle: t.catalog.eventSubtitle
    }
  }[mode];

  return (
    <div className="py-10 sm:py-14 bg-neutral-50 min-h-screen">
      <div className="mdp-container space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-2xs">
          <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
            {pageHeaderInfo.kicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mt-1">
            {pageHeaderInfo.title}
          </h1>
          <p className="mt-2 font-body text-sm sm:text-base text-[#737373] max-w-3xl">
            {pageHeaderInfo.subtitle}
          </p>

          {/* Category-Specific Sub-Navigation Tabs */}
          {mode === 'sale' && (
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: 'all', label: t.catalog.allForSale },
                { id: 'house', label: t.catalog.housesForSale },
                { id: 'villa', label: t.catalog.luxuryVillas },
                { id: 'apartment', label: t.catalog.apartmentsPenthouses },
                { id: 'commercial', label: t.catalog.commercialProps }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSearchFilters((prev) => ({ ...prev, category: item.id }))
                  }
                  className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold cursor-pointer transition-colors ${
                    searchFilters.category === item.id
                      ? 'bg-[#1150EF] text-white'
                      : 'bg-neutral-100 text-[#161616] hover:bg-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {mode === 'rent' && (
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: 'all', label: t.catalog.allRentals },
                { id: 'short_term', label: t.catalog.shortTermRetreats },
                { id: 'monthly', label: t.catalog.monthlyResidency },
                { id: 'long_term', label: t.catalog.longTermLeases }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSearchFilters((prev) => ({ ...prev, rentalDuration: item.id }))
                  }
                  className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold cursor-pointer transition-colors ${
                    searchFilters.rentalDuration === item.id
                      ? 'bg-[#1150EF] text-white'
                      : 'bg-neutral-100 text-[#161616] hover:bg-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {mode === 'event' && (
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: 'all', label: t.catalog.allEventVenues },
                { id: 'wedding', label: t.catalog.weddingVenues },
                { id: 'birthday', label: t.catalog.birthdayVenues },
                { id: 'conference', label: t.catalog.conferenceSpaces },
                { id: 'corporate', label: t.catalog.corporateSummits },
                { id: 'private', label: t.catalog.privateEvents }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedEventSubType(item.id as EventType | 'all')}
                  className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold cursor-pointer transition-colors ${
                    selectedEventSubType === item.id
                      ? 'bg-[#1150EF] text-white'
                      : 'bg-neutral-100 text-[#161616] hover:bg-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inline Advanced Search Bar */}
        <PropertySearchBar mode="inline" fixedTab={mode} />

        {/* Saved Searches Quick Bar (if any exist) */}
        {savedSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-ui">
            <span className="inline-flex items-center gap-1 font-semibold text-[#737373]">
              <Bookmark className="w-3.5 h-3.5 text-[#1150EF]" />
              {t.dashboard.savedSearches}:
            </span>
            {savedSearches.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    location: s.location,
                    category: s.category,
                    minPrice: s.minPrice ? String(s.minPrice) : '',
                    maxPrice: s.maxPrice ? String(s.maxPrice) : '',
                    bedrooms: s.bedrooms ? String(s.bedrooms) : '',
                    guestCapacity: s.guestCapacity ? String(s.guestCapacity) : ''
                  }))
                }
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-[#1150EF] text-[#161616] cursor-pointer transition-colors"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar: Results Count, Amenity Filter, Sort By, View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200/80">
          <div className="font-ui text-sm text-[#161616]">
            <strong className="tabular-nums font-bold text-[#1150EF]">
              {filteredProperties.length}
            </strong>{' '}
            {t.search.resultsFound}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Amenity Filter */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#737373]" />
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                aria-label={t.catalog.allAmenities}
                className="h-9 px-2.5 rounded-lg border border-neutral-200 text-xs font-ui text-[#161616] bg-neutral-50"
              >
                <option value="all">{t.catalog.allAmenities}</option>
                <option value="Pool">{t.catalog.amenityPool}</option>
                <option value="Ocean">{t.catalog.amenityOcean}</option>
                <option value="Solar">{t.catalog.amenitySolar}</option>
                <option value="Furnished">{t.catalog.amenityFurnished}</option>
                <option value="Security">{t.catalog.amenitySecurity}</option>
              </select>
            </div>

            {/* Sort By */}
            <select
              value={searchFilters.sortBy}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as typeof prev.sortBy
                }))
              }
              aria-label={t.catalog.sortFeatured}
              className="h-9 px-3 rounded-lg border border-neutral-200 text-xs font-ui font-medium text-[#161616] bg-neutral-50"
            >
              <option value="featured">{t.catalog.sortFeatured}</option>
              <option value="price_asc">{t.catalog.sortPriceAsc}</option>
              <option value="price_desc">{t.catalog.sortPriceDesc}</option>
              <option value="area_desc">{t.catalog.sortAreaDesc}</option>
              <option value="newest">{t.catalog.sortNewest}</option>
            </select>

            {/* View Switcher: Grid / List / Split Map */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title={t.catalog.viewGrid}
                className={`px-2.5 py-1.5 rounded-md text-xs font-ui font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#1150EF] shadow-2xs'
                    : 'text-[#737373] hover:text-[#161616]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.catalog.viewGrid}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title={t.catalog.viewList}
                className={`px-2.5 py-1.5 rounded-md text-xs font-ui font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#1150EF] shadow-2xs'
                    : 'text-[#737373] hover:text-[#161616]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.catalog.viewList}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                title={t.catalog.viewMap}
                className={`px-2.5 py-1.5 rounded-md text-xs font-ui font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-[#1150EF] shadow-2xs'
                    : 'text-[#737373] hover:text-[#161616]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.catalog.viewMap}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Map Preview (Always shown in Split mode or collapsible below) */}
        {viewMode === 'split' && filteredProperties.length > 0 && (
          <InteractiveMapDemo properties={filteredProperties} heightClass="h-[440px]" />
        )}

        {/* Listings Results */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
            <h3 className="font-display text-2xl text-[#0D0D0D]">
              {t.common.emptyResults}
            </h3>
            <p className="mt-2 font-body text-sm text-[#737373]">
              {t.catalog.emptySubtitle}
            </p>
            <button
              type="button"
              onClick={() => {
                resetSearchFilters();
                setSelectedEventSubType('all');
                setSelectedAmenity('all');
              }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.common.resetFilters}</span>
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-5">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} layout="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} layout="grid" />
            ))}
          </div>
        )}

        {/* Bottom Map Discovery Section when in standard Grid/List mode */}
        {viewMode !== 'split' && filteredProperties.length > 0 && (
          <div className="pt-6">
            <h2 className="font-display text-2xl text-[#0D0D0D] mb-4">
              {t.property.mapPreview}
            </h2>
            <InteractiveMapDemo properties={filteredProperties} heightClass="h-[380px]" />
          </div>
        )}
      </div>
    </div>
  );
};
