import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers, Trash2, X } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { translateAmenity, translatePropertyText } from '../translations';
import { PropertyImage } from './PropertyImage';

export const PropertyComparisonModal: React.FC = () => {
  const {
    t,
    language,
    properties,
    compareIds,
    toggleCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    formatPrice
  } = useMarketplace();

  if (!isCompareOpen || compareIds.length === 0) return null;

  const comparedProperties = compareIds
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.modals.compareTitle}
        className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#1150EF]" />
            <h2 className="font-display text-xl text-[#0D0D0D]">
              {t.modals.compareTitle} ({comparedProperties.length}/3)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                clearCompare();
                setIsCompareOpen(false);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-ui font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.modals.clearAllBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(false)}
              className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[640px]">
            {comparedProperties.map((prop) => {
              const localizedProp = translatePropertyText(prop.id, language, {
                title: prop.title,
                subtitle: prop.subtitle,
                description: prop.description
              });
              return (
                <div
                  key={prop.id}
                  className="rounded-xl border border-neutral-200 p-4 flex flex-col justify-between bg-neutral-50/40"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-neutral-100">
                      <PropertyImage
                        src={prop.images[0]}
                        alt={localizedProp.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCompare(prop.id)}
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[11px] font-ui cursor-pointer hover:bg-black"
                      >
                        {t.wizard.removeBtn}
                      </button>
                    </div>

                    <div className="text-[11px] font-ui font-bold uppercase text-[#1150EF]">
                      {t.categories[prop.category]} · {prop.referenceCode}
                    </div>
                    <h3 className="font-display text-lg text-[#0D0D0D] mt-0.5">
                      {localizedProp.title}
                    </h3>
                    <p className="text-xs font-body text-[#737373] mt-1">
                      {prop.location.neighborhood}, {prop.location.city}
                    </p>

                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2.5 text-xs font-ui">
                      <div className="flex justify-between">
                        <span className="text-[#737373]">{t.wizard.priceUsdLabel}</span>
                        <span className="font-bold text-[#0D0D0D] tabular-nums">
                          {formatPrice(prop.priceUSD, prop.priceUnit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737373]">{t.property.interiorTotalArea}</span>
                        <span className="font-semibold tabular-nums">
                          {prop.specs.areaSqm.toLocaleString()} {t.property.area}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737373]">
                          {t.property.beds} / {t.property.baths}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {prop.specs.bedrooms ?? '—'} / {prop.specs.bathrooms ?? '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737373]">{t.search.guestCapacity}</span>
                        <span className="font-semibold tabular-nums">
                          {prop.specs.guestCapacity
                            ? `${prop.specs.guestCapacity} ${t.property.guests}`
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#737373] block mb-1">
                          {t.wizard.keyAmenitiesLabel}
                        </span>
                        <p className="text-[#161616] leading-relaxed">
                          {prop.amenities
                            .slice(0, 5)
                            .map((am) => translateAmenity(am, language))
                            .join(' · ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/property/${prop.id}`}
                    onClick={() => setIsCompareOpen(false)}
                    className="mt-5 w-full py-2.5 px-4 rounded-lg bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>{t.sections.viewDetails}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
