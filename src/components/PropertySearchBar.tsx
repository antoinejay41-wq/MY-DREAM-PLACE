import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkPlus, RotateCcw, Search } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { ListingType } from '../types';

interface PropertySearchBarProps {
  mode?: 'hero' | 'inline';
  fixedTab?: ListingType;
}

export const PropertySearchBar: React.FC<PropertySearchBarProps> = ({
  mode = 'hero',
  fixedTab
}) => {
  const {
    t,
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    saveCurrentSearch
  } = useMarketplace();
  const navigate = useNavigate();

  const currentTab = fixedTab || searchFilters.tab;

  const tabs: { id: ListingType; label: string }[] = [
    { id: 'sale', label: t.search.tabBuy },
    { id: 'rent', label: t.search.tabRent },
    { id: 'land', label: t.search.tabLand },
    { id: 'event', label: t.search.tabEvent }
  ];

  const handleTabChange = (tab: ListingType) => {
    setSearchFilters((prev) => ({
      ...prev,
      tab,
      category:
        tab === 'land'
          ? 'land'
          : tab === 'event'
          ? 'event_space'
          : prev.category === 'land' || prev.category === 'event_space'
          ? 'all'
          : prev.category
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'hero') {
      const targetRoute =
        currentTab === 'sale'
          ? '/buy'
          : currentTab === 'rent'
          ? '/rent'
          : currentTab === 'land'
          ? '/land'
          : '/events';
      navigate(targetRoute);
    }
  };

  return (
    <div className="w-full max-w-full bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-4 sm:p-5 text-[#161616]">
      {/* Top Row: Category Mode Tabs + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100">
        {!fixedTab ? (
          <div
            role="tablist"
            aria-label="Property Search Mode"
            className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1 rounded-xl"
          >
            {tabs.map((tabItem) => {
              const active = currentTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(tabItem.id)}
                  className={`px-3.5 py-2 rounded-lg font-ui text-xs sm:text-[13px] font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                    active
                      ? 'bg-[#1150EF] text-white shadow-xs'
                      : 'text-[#161616] hover:text-[#1150EF]'
                  }`}
                >
                  {tabItem.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="font-ui text-xs font-bold uppercase tracking-wider text-[#1150EF]">
            {tabs.find((x) => x.id === fixedTab)?.label} — {t.search.advancedFilterSuffix}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => saveCurrentSearch()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ui font-semibold text-[#1150EF] bg-[#1150EF]/8 hover:bg-[#1150EF]/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{t.search.saveSearch}</span>
          </button>
          <button
            type="button"
            onClick={resetSearchFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-ui font-medium text-[#737373] hover:text-[#161616] hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.search.clearFilters}</span>
          </button>
        </div>
      </div>

      {/* Responsive Search Fields Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* 1. Location */}
          <div className="min-w-0">
            <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
              {t.search.locationLabel}
            </label>
            <input
              type="text"
              value={searchFilters.location}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder={t.search.locationPlaceholder}
              className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] placeholder:text-neutral-400 focus:outline-none focus:border-[#1150EF] focus:bg-white"
            />
          </div>

          {/* 2. Property Category */}
          <div className="min-w-0">
            <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
              {t.search.categoryLabel}
            </label>
            <select
              value={searchFilters.category}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] focus:outline-none focus:border-[#1150EF] focus:bg-white"
            >
              <option value="all">{t.search.allCategories}</option>
              <option value="house">{t.categories.house}</option>
              <option value="villa">{t.categories.villa}</option>
              <option value="apartment">{t.categories.apartment}</option>
              <option value="commercial">{t.categories.commercial}</option>
              <option value="land">{t.categories.land}</option>
              <option value="event_space">{t.categories.event_space}</option>
            </select>
          </div>

          {/* 3. Minimum Price */}
          <div className="min-w-0">
            <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
              {t.search.minPrice} (USD)
            </label>
            <select
              value={searchFilters.minPrice}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, minPrice: e.target.value }))
              }
              className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] focus:outline-none focus:border-[#1150EF] focus:bg-white tabular-nums"
            >
              <option value="">{t.search.anyPrice}</option>
              {currentTab === 'rent' || currentTab === 'event' ? (
                <>
                  <option value="500">$500+</option>
                  <option value="1500">$1,500+</option>
                  <option value="3000">$3,000+</option>
                  <option value="5000">$5,000+</option>
                </>
              ) : (
                <>
                  <option value="250000">$250,000+</option>
                  <option value="500000">$500,000+</option>
                  <option value="1000000">$1,000,000+</option>
                  <option value="2000000">$2,000,000+</option>
                </>
              )}
            </select>
          </div>

          {/* 4. Maximum Price */}
          <div className="min-w-0">
            <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
              {t.search.maxPrice} (USD)
            </label>
            <select
              value={searchFilters.maxPrice}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
              className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] focus:outline-none focus:border-[#1150EF] focus:bg-white tabular-nums"
            >
              <option value="">{t.search.anyPrice}</option>
              {currentTab === 'rent' || currentTab === 'event' ? (
                <>
                  <option value="2500">{t.search.upTo} $2,500</option>
                  <option value="5000">{t.search.upTo} $5,000</option>
                  <option value="10000">{t.search.upTo} $10,000</option>
                </>
              ) : (
                <>
                  <option value="750000">{t.search.upTo} $750,000</option>
                  <option value="1500000">{t.search.upTo} $1,500,000</option>
                  <option value="3000000">{t.search.upTo} $3,000,000</option>
                  <option value="5000000">{t.search.upTo} $5,000,000</option>
                </>
              )}
            </select>
          </div>

          {/* 5. Context-Specific Field: Bedrooms / Rental Duration / Guest Capacity */}
          {currentTab === 'event' ? (
            <div className="min-w-0">
              <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
                {t.search.guestCapacity}
              </label>
              <select
                value={searchFilters.guestCapacity}
                onChange={(e) =>
                  setSearchFilters((prev) => ({ ...prev, guestCapacity: e.target.value }))
                }
                className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] focus:outline-none focus:border-[#1150EF] focus:bg-white tabular-nums"
              >
                <option value="">{t.search.anyCapacity}</option>
                <option value="100">100+ {t.search.guestsPlus}</option>
                <option value="200">200+ {t.search.guestsPlus}</option>
                <option value="300">300+ {t.search.guestsPlus}</option>
              </select>
            </div>
          ) : currentTab === 'rent' ? (
            <div className="min-w-0">
              <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
                {t.search.rentalDuration}
              </label>
              <select
                value={searchFilters.rentalDuration}
                onChange={(e) =>
                  setSearchFilters((prev) => ({ ...prev, rentalDuration: e.target.value }))
                }
                className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] focus:outline-none focus:border-[#1150EF] focus:bg-white"
              >
                <option value="all">{t.search.anyDuration}</option>
                <option value="short_term">{t.search.shortTerm}</option>
                <option value="monthly">{t.search.monthly}</option>
                <option value="long_term">{t.search.longTerm}</option>
              </select>
            </div>
          ) : (
            <div className="min-w-0">
              <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1">
                {t.search.bedrooms}
              </label>
              <select
                value={searchFilters.bedrooms}
                onChange={(e) =>
                  setSearchFilters((prev) => ({ ...prev, bedrooms: e.target.value }))
                }
                className="w-full h-[44px] px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-body text-[#161616] focus:outline-none focus:border-[#1150EF] focus:bg-white tabular-nums"
              >
                <option value="">{t.search.anyBedrooms}</option>
                <option value="2">2+ {t.property.beds}</option>
                <option value="3">3+ {t.property.beds}</option>
                <option value="4">4+ {t.property.beds}</option>
                <option value="5">5+ {t.property.beds}</option>
              </select>
            </div>
          )}

          {/* 6. Search Submit Button */}
          <div className="min-w-0">
            <button
              type="submit"
              className="w-full h-[44px] px-5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>{t.search.searchButton}</span>
            </button>
          </div>
        </div>

        {/* Optional Extra Row for Event Date or Rent Bedrooms */}
        {(currentTab === 'event' || currentTab === 'rent') && (
          <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentTab === 'event' && (
              <div className="flex items-center gap-2">
                <label className="font-ui text-xs font-semibold text-[#737373] whitespace-nowrap">
                  {t.search.eventDate}:
                </label>
                <input
                  type="date"
                  value={searchFilters.eventDate}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({ ...prev, eventDate: e.target.value }))
                  }
                  className="h-9 px-3 rounded-lg border border-neutral-200 text-xs font-ui text-[#161616]"
                />
              </div>
            )}
            {currentTab === 'rent' && (
              <div className="flex items-center gap-2">
                <label className="font-ui text-xs font-semibold text-[#737373] whitespace-nowrap">
                  {t.search.bedrooms}:
                </label>
                <select
                  value={searchFilters.bedrooms}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({ ...prev, bedrooms: e.target.value }))
                  }
                  className="h-9 px-3 rounded-lg border border-neutral-200 text-xs font-ui text-[#161616]"
                >
                  <option value="">{t.search.anyBedrooms}</option>
                  <option value="2">2+ {t.property.beds}</option>
                  <option value="3">3+ {t.property.beds}</option>
                  <option value="4">4+ {t.property.beds}</option>
                </select>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
