import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, Layers, MapPin } from 'lucide-react';
import { Property } from '../types';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { translatePropertyText } from '../translations';
import { PropertyImage } from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout = 'grid' }) => {
  const { t, language, formatPrice, favorites, toggleFavorite, compareIds, toggleCompare } =
    useMarketplace();

  const isFavorite = favorites.includes(property.id);
  const isCompared = compareIds.includes(property.id);

  const localized = translatePropertyText(property.id, language, property);

  const listingTypeLabel =
    property.listingType === 'sale'
      ? t.property.forSale
      : property.listingType === 'rent'
      ? t.property.forRent
      : property.listingType === 'land'
      ? t.property.landParcel
      : t.property.eventVenue;

  const categoryLabel = t.categories[property.category];

  const rentalDurationLabel =
    property.rentalDuration === 'short_term'
      ? t.search.shortTerm
      : property.rentalDuration === 'long_term'
      ? t.search.longTerm
      : property.rentalDuration === 'monthly'
      ? t.search.monthly
      : undefined;

  if (layout === 'list') {
    return (
      <article className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden transition-all duration-200 hover:border-[#1150EF]/40 hover:shadow-lg flex flex-col md:flex-row">
        <div className="relative md:w-[340px] lg:w-[380px] h-[240px] md:h-auto shrink-0 overflow-hidden bg-neutral-100">
          <Link to={`/property/${property.id}`} className="block w-full h-full">
            <PropertyImage
              src={property.images[0]}
              alt={localized.title}
              categoryLabel={categoryLabel}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleCompare(property.id)}
              title={t.property.compareAdd}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#1150EF] text-white'
                  : 'bg-white/90 text-[#161616] hover:bg-white'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(property.id)}
              title={t.property.saveFavorite}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/90 text-[#161616] hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Unboxed Metadata Discipline */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-ui text-[#737373] mb-2">
              <span className="font-semibold text-[#1150EF] uppercase tracking-wider">
                {listingTypeLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>{categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{property.referenceCode}</span>
            </div>

            <Link
              to={`/property/${property.id}`}
              className="block font-display text-xl text-[#0D0D0D] group-hover:text-[#1150EF] transition-colors line-clamp-1"
            >
              {localized.title}
            </Link>

            <p className="mt-1 flex items-center gap-1.5 font-body text-xs text-[#737373]">
              <MapPin className="w-3.5 h-3.5 text-[#1150EF] shrink-0" />
              <span className="truncate">
                {property.location.neighborhood}, {property.location.city} ·{' '}
                {property.location.country}
              </span>
            </p>

            <p className="mt-3 font-body text-sm text-[#161616]/80 line-clamp-2">
              {localized.description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-ui text-[#161616] tabular-nums">
              {property.specs.bedrooms !== undefined && (
                <>
                  <span>
                    <strong>{property.specs.bedrooms}</strong> {t.property.beds}
                  </span>
                  <span aria-hidden="true" className="text-neutral-300">
                    ·
                  </span>
                </>
              )}
              {property.specs.bathrooms !== undefined && (
                <>
                  <span>
                    <strong>{property.specs.bathrooms}</strong> {t.property.baths}
                  </span>
                  <span aria-hidden="true" className="text-neutral-300">
                    ·
                  </span>
                </>
              )}
              {property.specs.guestCapacity !== undefined && (
                <>
                  <span>
                    <strong>{property.specs.guestCapacity}</strong> {t.property.guests}
                  </span>
                  <span aria-hidden="true" className="text-neutral-300">
                    ·
                  </span>
                </>
              )}
              <span>
                <strong>{property.specs.areaSqm.toLocaleString()}</strong> {t.property.area}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums">
                {formatPrice(property.priceUSD, property.priceUnit)}
              </div>
              <Link
                to={`/property/${property.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <span>{t.sections.viewDetails}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1150EF]/40 hover:shadow-lg flex flex-col h-full">
      {/* Image Container — 4:3 Uniform Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Link to={`/property/${property.id}`} className="block w-full h-full">
          <PropertyImage
            src={property.images[0]}
            alt={localized.title}
            categoryLabel={categoryLabel}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Action Affordances (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={() => toggleCompare(property.id)}
            aria-label={t.property.compareAdd}
            title={t.property.compareAdd}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
              isCompared
                ? 'bg-[#1150EF] text-white shadow-sm'
                : 'bg-white/90 text-[#161616] hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(property.id)}
            aria-label={t.property.saveFavorite}
            title={t.property.saveFavorite}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white/90 text-[#161616] hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-ui text-[#737373] mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[#1150EF]">
              {listingTypeLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{categoryLabel}</span>
            {rentalDurationLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{rentalDurationLabel}</span>
              </>
            )}
          </div>

          <Link
            to={`/property/${property.id}`}
            className="block font-display text-lg font-medium text-[#0D0D0D] group-hover:text-[#1150EF] transition-colors line-clamp-1"
          >
            {localized.title}
          </Link>

          <p className="mt-1 flex items-center gap-1 text-xs font-body text-[#737373] truncate">
            <MapPin className="w-3.5 h-3.5 text-[#1150EF] shrink-0" />
            <span className="truncate">
              {property.location.neighborhood}, {property.location.city}
            </span>
          </p>

          {/* Specs Line */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-ui text-[#161616]/85 tabular-nums">
            {property.specs.bedrooms !== undefined && (
              <>
                <span>
                  <strong>{property.specs.bedrooms}</strong> {t.property.beds}
                </span>
                <span aria-hidden="true" className="text-neutral-300">
                  ·
                </span>
              </>
            )}
            {property.specs.bathrooms !== undefined && (
              <>
                <span>
                  <strong>{property.specs.bathrooms}</strong> {t.property.baths}
                </span>
                <span aria-hidden="true" className="text-neutral-300">
                  ·
                </span>
              </>
            )}
            {property.specs.guestCapacity !== undefined && (
              <>
                <span>
                  <strong>{property.specs.guestCapacity}</strong> {t.property.guests}
                </span>
                <span aria-hidden="true" className="text-neutral-300">
                  ·
                </span>
              </>
            )}
            <span>
              <strong>{property.specs.areaSqm.toLocaleString()}</strong> {t.property.area}
            </span>
          </div>
        </div>

        {/* Price & View Details Baseline */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="font-ui text-[16px] font-bold text-[#0D0D0D] tabular-nums truncate">
            {formatPrice(property.priceUSD, property.priceUnit)}
          </div>
          <Link
            to={`/property/${property.id}`}
            className="inline-flex items-center gap-1 font-ui text-xs font-semibold text-[#1150EF] hover:text-[#135AF3] whitespace-nowrap shrink-0"
          >
            <span>{t.sections.viewDetails}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
