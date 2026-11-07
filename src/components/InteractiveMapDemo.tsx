import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, MapPin, Maximize2, Minimize2 } from 'lucide-react';
import { Property } from '../types';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { translatePropertyText } from '../translations';
import { PropertyImage } from './PropertyImage';

interface InteractiveMapDemoProps {
  properties: Property[];
  selectedPropertyId?: string;
  heightClass?: string;
}

export const InteractiveMapDemo: React.FC<InteractiveMapDemoProps> = ({
  properties,
  selectedPropertyId,
  heightClass = 'h-[420px]'
}) => {
  const { t, language, formatPrice } = useMarketplace();
  const [activeId, setActiveId] = useState<string | undefined>(
    selectedPropertyId || properties[0]?.id
  );
  const [expanded, setExpanded] = useState(false);

  const activeProperty =
    properties.find((p) => p.id === activeId) || properties[0];

  const localizedActiveProperty = activeProperty
    ? translatePropertyText(activeProperty.id, language, {
        title: activeProperty.title,
        subtitle: activeProperty.subtitle,
        description: activeProperty.description
      })
    : null;

  // Deterministic normalized map position inside the architectural SVG canvas
  const getPinPosition = (prop: Property, idx: number) => {
    const lat = prop.location.coordinates.lat;
    const lng = prop.location.coordinates.lng;
    const normX = ((Math.abs(lng * 100) + idx * 19) % 76) + 12;
    const normY = ((Math.abs(lat * 100) + idx * 23) % 68) + 16;
    return { left: `${normX}%`, top: `${normY}%` };
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-neutral-200 bg-[#0d1f49] shadow-sm transition-all ${
        expanded ? 'h-[620px]' : heightClass
      }`}
    >
      {/* Topographic & Coastal Architectural Map Vector Background */}
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b245b" />
            <stop offset="50%" stopColor="#1150ef" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
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

        {/* Stylized Landmasses & Coastlines */}
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
        {/* Roads / Arterial Lines */}
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

      {/* Top Demonstration Notice Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[#161616] shadow-md text-xs font-ui font-medium border border-neutral-200/80">
          <Compass className="w-4 h-4 text-[#1150EF] shrink-0" />
          <span>{t.property.mapDemoNotice}</span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#161616] shadow-md text-xs font-ui font-semibold cursor-pointer"
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

      {/* Interactive Property Pins */}
      <div className="absolute inset-0 z-10">
        {properties.slice(0, 14).map((prop, idx) => {
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

      {/* Selected Property Floating Preview Card */}
      {activeProperty && localizedActiveProperty && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-[360px] bg-white/98 backdrop-blur-md rounded-xl p-3 shadow-xl border border-neutral-200 z-20 flex items-center gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
            <PropertyImage
              src={activeProperty.images[0]}
              alt={localizedActiveProperty.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-ui font-bold uppercase tracking-wider text-[#1150EF]">
              {activeProperty.location.city} · {activeProperty.referenceCode}
            </div>
            <h4 className="font-display text-sm font-semibold text-[#0D0D0D] truncate">
              {localizedActiveProperty.title}
            </h4>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="font-ui text-xs font-bold text-[#161616] tabular-nums">
                {formatPrice(activeProperty.priceUSD, activeProperty.priceUnit)}
              </span>
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
      )}
    </div>
  );
};
