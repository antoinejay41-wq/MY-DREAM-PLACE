import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarHeart,
  CheckCircle2,
  Compass,
  Home,
  Landmark,
  MapPin,
  ShieldCheck,
  Trees
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { SCENEAI_IMAGES } from '../data/mockData';
import { translatePropertyText } from '../translations';
import { PropertyCategory } from '../types';
import { HeroVideoCard } from '../components/HeroVideoCard';
import { PropertySearchBar } from '../components/PropertySearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyImage } from '../components/PropertyImage';
import { InteractiveMapDemo } from '../components/InteractiveMapDemo';

export const HomePage: React.FC = () => {
  const {
    t,
    language,
    publicProperties,
    websiteContent,
    branding,
    formatPrice,
    setSearchFilters
  } = useMarketplace();
  const navigate = useNavigate();

  const isEn = language === 'en';
  const secVis = branding.sectionVisibility || {
    heroVideoCard: true,
    latestPlaces: true,
    categoriesStrip: true,
    featuredHouses: true,
    featuredApartments: true,
    landAndEvents: true,
    popularLocations: true,
    aboutSection: true,
    howItWorksAndTrust: true,
    ownerCtaBanner: true
  };

  // Tagline words staggered by 0.06s starting at 1.15s (Section 5)
  const rawTagline1 = isEn
    ? websiteContent.heroTaglineLine1 || t.hero.tagline1
    : t.hero.tagline1;
  const rawTagline2 = isEn
    ? websiteContent.heroTaglineLine2 || t.hero.tagline2
    : t.hero.tagline2;
  const taglineLine1Words = rawTagline1.split(' ');
  const taglineLine2Words = rawTagline2.split(' ');

  // Sort helper respecting admin featuredOrder
  const sortByFeaturedOrder = (list: typeof publicProperties) =>
    [...list].sort((a, b) => {
      const oa = a.featuredOrder ?? 999;
      const ob = b.featuredOrder ?? 999;
      if (oa !== ob) return oa - ob;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  // Section 12: Three editorial latest places
  const latestPlaces = sortByFeaturedOrder(
    publicProperties.filter((p) => p.latestEditorial || p.featured)
  ).slice(0, 3);

  // Category-specific collections for Page 1
  const featuredHouses = sortByFeaturedOrder(
    publicProperties.filter(
      (p) => (p.category === 'house' || p.category === 'villa') && p.listingType === 'sale'
    )
  ).slice(0, 3);

  const featuredApartments = sortByFeaturedOrder(
    publicProperties.filter((p) => p.category === 'apartment')
  ).slice(0, 3);

  const featuredLandAndEvents = sortByFeaturedOrder(
    publicProperties.filter((p) => p.listingType === 'land' || p.listingType === 'event')
  ).slice(0, 3);

  const handlePrimaryHeroCta = () => {
    const link = websiteContent.heroPrimaryCtaLink || '#discovery-section';
    if (link.startsWith('#')) {
      const el = document.getElementById(link.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(link);
    }
  };

  const allCategoryDefs: Record<
    PropertyCategory,
    { key: string; label: string; count: number; icon: React.ComponentType<{ className?: string }>; to: string }
  > = {
    house: {
      key: 'house',
      label: t.categories.house,
      count: publicProperties.filter((p) => p.category === 'house' || p.category === 'villa').length,
      icon: Home,
      to: '/buy?category=house'
    },
    villa: {
      key: 'villa',
      label: t.categories.villa,
      count: publicProperties.filter((p) => p.category === 'villa').length,
      icon: Home,
      to: '/buy?category=villa'
    },
    apartment: {
      key: 'apartment',
      label: t.categories.apartment,
      count: publicProperties.filter((p) => p.category === 'apartment').length,
      icon: Building2,
      to: '/buy?category=apartment'
    },
    land: {
      key: 'land',
      label: t.categories.land,
      count: publicProperties.filter((p) => p.category === 'land').length,
      icon: Trees,
      to: '/land'
    },
    event_space: {
      key: 'event_space',
      label: t.categories.event_space,
      count: publicProperties.filter((p) => p.category === 'event_space').length,
      icon: CalendarHeart,
      to: '/events'
    },
    commercial: {
      key: 'commercial',
      label: t.categories.commercial,
      count: publicProperties.filter((p) => p.category === 'commercial').length,
      icon: Landmark,
      to: '/buy?category=commercial'
    }
  };

  const orderedCategoryKeys: PropertyCategory[] =
    websiteContent.homepageCategoryOrder && websiteContent.homepageCategoryOrder.length > 0
      ? websiteContent.homepageCategoryOrder
      : ['house', 'apartment', 'land', 'event_space', 'commercial'];

  const categoryCards = orderedCategoryKeys
    .map((k) => allCategoryDefs[k])
    .filter(Boolean);

  const popularDestinations = [
    { city: 'Cap Cana & Punta Cana', country: 'Dominican Republic', query: 'Cap Cana', count: 4 },
    { city: 'Pétion-Ville & Kenscoff', country: 'Haiti', query: 'Pétion-Ville', count: 5 },
    { city: 'Las Terrenas & Samaná', country: 'Dominican Republic', query: 'Las Terrenas', count: 3 },
    { city: 'Cap-Haïtien & Labadee', country: 'Haiti', query: 'Cap-Haïtien', count: 3 },
    { city: 'Santo Domingo', country: 'Dominican Republic', query: 'Santo Domingo', count: 3 },
    { city: 'Miami Beach', country: 'United States', query: 'Miami', count: 2 }
  ];

  const heroGradientStyle = branding.primaryColor
    ? {
        backgroundImage: `radial-gradient(40% 18% at 30% 12%, rgba(120, 170, 255, 0.35) 0%, transparent 70%), radial-gradient(35% 14% at 78% 26%, rgba(130, 175, 255, 0.28) 0%, transparent 70%), linear-gradient(180deg, ${branding.primaryColor} 0%, ${branding.secondaryColor || '#135af3'} 35%, ${branding.skyBlueColor || '#76a2fa'} 68%, ${branding.lightBlueColor || '#b9cffd'} 86%, #ffffff 100%)`
      }
    : undefined;

  return (
    <div className="w-full">
      {/* =====================================================================
          SECTION 3, 4, 5: PREMIUM CINEMATIC HERO
      ====================================================================== */}
      <section
        style={heroGradientStyle}
        className="relative w-full mdp-hero-bg pt-6 sm:pt-10 pb-12 overflow-hidden"
      >
        {/* Four Vertical Architectural Grid Lines (4.8%, 35.45%, 64.7%, 95.2%) */}
        {branding.showGridLines && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
            <div
              style={{ left: '4.8%', animationDelay: '0s' }}
              className="animate-grid-line absolute top-0 bottom-0 w-px bg-white/28"
            />
            <div
              style={{ left: '35.45%', animationDelay: '0.1s' }}
              className="animate-grid-line absolute top-0 bottom-0 w-px bg-white/28"
            />
            <div
              style={{ left: '64.7%', animationDelay: '0.2s' }}
              className="animate-grid-line absolute top-0 bottom-0 w-px bg-white/28"
            />
            <div
              style={{ left: '95.2%', animationDelay: '0.3s' }}
              className="animate-grid-line absolute top-0 bottom-0 w-px bg-white/28"
            />
          </div>
        )}

        <div className="mdp-container relative z-10">
          {/* Top Editorial Grid: Headline Left, Tagline + CTA Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Headline: MY / DREAM / PLACE */}
            <div className="lg:col-span-7 min-w-0">
              <h1 className="font-display font-normal uppercase text-white tracking-tight leading-[0.92] text-[clamp(44px,6.8vw,116px)] select-none">
                <span style={{ animationDelay: '0.55s' }} className="animate-word-in block">
                  {websiteContent.heroHeadlineLine1 || t.hero.line1}
                </span>
                <span style={{ animationDelay: '0.75s' }} className="animate-word-in block">
                  {websiteContent.heroHeadlineLine2 || t.hero.line2}
                </span>
                <span style={{ animationDelay: '0.95s' }} className="animate-word-in block">
                  {websiteContent.heroHeadlineLine3 || t.hero.line3}
                </span>
              </h1>
            </div>

            {/* Tagline & Explore Properties CTA */}
            <div className="lg:col-span-5 lg:pt-4 flex flex-col items-start lg:items-end lg:text-right justify-between gap-6">
              <div className="font-body uppercase tracking-[0.14em] text-white/95 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                <div className="flex flex-wrap lg:justify-end gap-x-2">
                  {taglineLine1Words.map((word, idx) => (
                    <span
                      key={`t1-${idx}`}
                      style={{ animationDelay: `${(1.15 + idx * 0.06).toFixed(2)}s` }}
                      className="animate-word-in inline-block"
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap lg:justify-end gap-x-2">
                  {taglineLine2Words.map((word, idx) => (
                    <span
                      key={`t2-${idx}`}
                      style={{
                        animationDelay: `${(
                          1.15 +
                          (taglineLine1Words.length + idx) * 0.06
                        ).toFixed(2)}s`
                      }}
                      className="animate-word-in inline-block"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main CTA: EXPLORE PROPERTIES at 1.85s delay */}
              <div
                style={{ animationDelay: '1.85s' }}
                className="animate-word-in flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={handlePrimaryHeroCta}
                  className={`group min-h-[48px] px-6 py-3 ${branding.buttonRadius || 'rounded-full'} bg-white text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white font-ui text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center gap-2.5 shadow-xl transition-all duration-200 cursor-pointer`}
                >
                  <span>
                    {isEn && websiteContent.heroPrimaryCtaText
                      ? websiteContent.heroPrimaryCtaText
                      : t.hero.exploreCta}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#1150EF] text-white flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </button>

                {websiteContent.heroSecondaryCtaText && (
                  <Link
                    to={websiteContent.heroSecondaryCtaLink || '/list-property'}
                    className={`min-h-[48px] px-5 py-3 ${branding.buttonRadius || 'rounded-full'} bg-white/15 hover:bg-white/25 text-white border border-white/30 font-ui text-xs sm:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2 transition-all`}
                  >
                    <span>
                      {isEn ? websiteContent.heroSecondaryCtaText : t.nav.listProperty}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Lower Hero Visual Showcase: Video Card Left + Main Architectural Image Right */}
          <div className="mt-8 lg:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
            {/* Hero Video Card (Section 4) */}
            {secVis.heroVideoCard ? (
              <div className="lg:col-span-4 order-2 lg:order-1 z-10">
                <HeroVideoCard />
              </div>
            ) : (
              <div className="lg:col-span-2 order-2 lg:order-1" />
            )}

            {/* Main Architectural Image (Section 3) */}
            <div
              className={`${secVis.heroVideoCard ? 'lg:col-span-8' : 'lg:col-span-12'} order-1 lg:order-2 flex justify-end min-w-0`}
            >
              <div className="animate-house-entrance w-full lg:w-[92%] max-w-full rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/20 backdrop-blur-xs">
                <PropertyImage
                  src={websiteContent.heroBgImage || SCENEAI_IMAGES.heroMain}
                  alt="MY DREAM PLACE Architectural Flagship Residence"
                  className="w-full h-auto max-h-[540px] object-cover block"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Floating Homepage Property Search */}
          <div id="discovery-section" className="mt-8 sm:mt-10 relative z-20">
            <PropertySearchBar mode="hero" />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 12: OUR LATEST PLACES (THREE-IMAGE EDITORIAL GALLERY)
      ====================================================================== */}
      {secVis.latestPlaces && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="mdp-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="font-display font-normal uppercase text-[#0D0D0D] text-[clamp(32px,4.2vw,56px)] leading-[0.95] tracking-tight">
                  <span className="block border-b border-[#0D0D0D]/20 pb-1 inline-block pr-8">
                    {isEn && websiteContent.latestPlacesTitleLine1
                      ? websiteContent.latestPlacesTitleLine1
                      : t.sections.latestPlacesLine1}
                  </span>
                  <span className="block border-b border-[#0D0D0D]/20 py-1">
                    {isEn && websiteContent.latestPlacesTitleLine2
                      ? websiteContent.latestPlacesTitleLine2
                      : t.sections.latestPlacesLine2}
                  </span>
                  <span className="block pt-1 text-[#1150EF]">
                    {isEn && websiteContent.latestPlacesTitleLine3
                      ? websiteContent.latestPlacesTitleLine3
                      : t.sections.latestPlacesLine3}
                  </span>
                </h2>
              </div>
              <div className="max-w-md">
                <p className="font-body text-sm sm:text-base text-[#737373] leading-relaxed">
                  {isEn && websiteContent.latestPlacesSubtitle
                    ? websiteContent.latestPlacesSubtitle
                    : t.sections.latestSubtitle}
                </p>
                <div className="mt-4 h-px w-full bg-neutral-200" />
              </div>
            </div>

            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 no-scrollbar">
              {latestPlaces.map((place, idx) => {
                const listingBadge =
                  place.listingType === 'sale'
                    ? t.property.forSale
                    : place.listingType === 'rent'
                      ? t.property.forRent
                      : place.listingType === 'land'
                        ? t.property.landParcel
                        : t.property.eventVenue;

                const localizedPlace = translatePropertyText(place.id, language, place);

                return (
                  <article
                    key={place.id}
                    style={{ animationDelay: `${0.15 * idx}s` }}
                    className="snap-start shrink-0 w-[85vw] sm:w-[360px] md:w-auto group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl"
                  >
                    <Link
                      to={`/property/${place.id}`}
                      className="block relative aspect-[4/3] w-full overflow-hidden bg-neutral-100"
                    >
                      <PropertyImage
                        src={place.images[0]}
                        alt={localizedPlace.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="font-ui text-xs font-bold uppercase tracking-widest">
                          0{idx + 1} · {listingBadge}
                        </span>
                        <span className="font-ui text-xs tabular-nums opacity-90">
                          {place.referenceCode}
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-body text-[#737373] mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#1150EF] shrink-0" />
                          <span>
                            {place.location.neighborhood}, {place.location.city}
                          </span>
                        </div>
                        <Link
                          to={`/property/${place.id}`}
                          className="block font-display text-2xl text-[#0D0D0D] group-hover:text-[#1150EF] transition-colors"
                        >
                          {localizedPlace.title}
                        </Link>
                        {localizedPlace.subtitle && (
                          <p className="mt-2 font-body text-xs sm:text-sm text-[#737373] line-clamp-2">
                            {localizedPlace.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                        <span className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums">
                          {formatPrice(place.priceUSD, place.priceUnit)}
                        </span>
                        <Link
                          to={`/property/${place.id}`}
                          className="inline-flex items-center gap-1.5 font-ui text-xs font-bold uppercase tracking-wider text-[#1150EF] group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>{t.sections.viewDetails}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          ARCHITECTURAL CATEGORIES STRIP
      ====================================================================== */}
      {secVis.categoriesStrip && (
        <section className="py-14 bg-neutral-50 border-y border-neutral-200/70">
          <div className="mdp-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                  {isEn && websiteContent.categoriesSectionKicker
                    ? websiteContent.categoriesSectionKicker
                    : t.sections.portfolioTaxonomyKicker}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-[#0D0D0D] mt-1">
                  {isEn && websiteContent.categoriesSectionTitle
                    ? websiteContent.categoriesSectionTitle
                    : t.sections.browseByCategory}
                </h2>
              </div>
              <Link
                to="/buy"
                className="inline-flex items-center gap-1.5 font-ui text-xs font-semibold text-[#1150EF] hover:underline"
              >
                <span>{t.sections.viewAll}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categoryCards.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.key}
                    to={cat.to}
                    className="group bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-[#1150EF] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#1150EF]/8 group-hover:bg-[#1150EF] text-[#1150EF] group-hover:text-white flex items-center justify-center transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="mt-5">
                      <h3 className="font-display text-lg text-[#0D0D0D] group-hover:text-[#1150EF] transition-colors">
                        {cat.label}
                      </h3>
                      <p className="mt-1 font-ui text-xs text-[#737373] tabular-nums">
                        {cat.count} {t.search.resultsFound}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          FEATURED HOUSES & VILLAS FOR SALE
      ====================================================================== */}
      {secVis.featuredHouses && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="mdp-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                  {isEn && websiteContent.featuredHousesKicker
                    ? websiteContent.featuredHousesKicker
                    : t.sections.sec1Kicker}
                </p>
                <h2 className="font-display text-2xl sm:text-4xl text-[#0D0D0D] mt-1">
                  {isEn && websiteContent.featuredHousesTitle
                    ? websiteContent.featuredHousesTitle
                    : t.sections.featuredHouses}
                </h2>
              </div>
              <Link
                to="/buy"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-[#1150EF] hover:text-white font-ui text-xs font-semibold text-[#161616] transition-colors self-start sm:self-auto"
              >
                <span>{t.sections.viewAll}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredHouses.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          FEATURED APARTMENTS & PENTHOUSES (BUY & RENT)
      ====================================================================== */}
      {secVis.featuredApartments && (
        <section className="py-16 sm:py-20 bg-neutral-50 border-t border-neutral-200/70">
          <div className="mdp-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                  {isEn && websiteContent.featuredApartmentsKicker
                    ? websiteContent.featuredApartmentsKicker
                    : t.sections.sec2Kicker}
                </p>
                <h2 className="font-display text-2xl sm:text-4xl text-[#0D0D0D] mt-1">
                  {isEn && websiteContent.featuredApartmentsTitle
                    ? websiteContent.featuredApartmentsTitle
                    : t.sections.featuredApartments}
                </h2>
              </div>
              <Link
                to="/rent"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-[#1150EF] font-ui text-xs font-semibold text-[#161616] transition-colors self-start sm:self-auto"
              >
                <span>{t.sections.exploreRentalsBtn}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredApartments.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          PRIME LAND PARCELS & DISTINGUISHED EVENT VENUES
      ====================================================================== */}
      {secVis.landAndEvents && (
        <section className="py-16 sm:py-20 bg-white border-t border-neutral-200/70">
          <div className="mdp-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                  {isEn && websiteContent.landEventsKicker
                    ? websiteContent.landEventsKicker
                    : t.sections.sec3Kicker}
                </p>
                <h2 className="font-display text-2xl sm:text-4xl text-[#0D0D0D] mt-1">
                  {isEn && websiteContent.landEventsTitle
                    ? websiteContent.landEventsTitle
                    : `${t.sections.primeLand} & ${t.sections.signatureEventSpaces}`}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/land"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-[#1150EF] hover:text-white font-ui text-xs font-semibold transition-colors"
                >
                  <span>{t.nav.land}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1150EF] text-white hover:bg-[#135AF3] font-ui text-xs font-semibold transition-colors"
                >
                  <span>{t.nav.eventSpaces}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredLandAndEvents.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          POPULAR DESTINATIONS
      ====================================================================== */}
      {secVis.popularLocations && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200/70">
          <div className="mdp-container">
            <div className="mb-8">
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                {isEn && websiteContent.popularLocationsKicker
                  ? websiteContent.popularLocationsKicker
                  : t.sections.regionalPresenceKicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-[#0D0D0D] mt-1">
                {isEn && websiteContent.popularLocationsTitle
                  ? websiteContent.popularLocationsTitle
                  : t.sections.popularLocations}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.city}
                  type="button"
                  onClick={() => {
                    setSearchFilters((prev) => ({ ...prev, location: dest.query }));
                    navigate('/buy');
                  }}
                  className="group p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#1150EF] text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <div>
                    <div className="font-ui text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                      {dest.country}
                    </div>
                    <h3 className="font-display text-xl text-[#0D0D0D] group-hover:text-[#1150EF] transition-colors mt-0.5">
                      {dest.city}
                    </h3>
                    <p className="font-ui text-xs text-[#1150EF] mt-1 tabular-nums">
                      {dest.count} {t.sections.activeListingsCount}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-[#1150EF] group-hover:text-white flex items-center justify-center transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            {/* Interactive Google Maps Property Explorer */}
            <div className="mt-8">
              <InteractiveMapDemo
                properties={publicProperties}
                heightClass="h-[440px]"
              />
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          ABOUT SECTION (EDITABLE VIA ADMIN CMS)
      ====================================================================== */}
      {secVis.aboutSection && (
        <section className="py-16 sm:py-20 bg-white border-t border-neutral-200/70">
          <div className="mdp-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-4">
                <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                  {websiteContent.aboutSectionKicker || 'ARCHITECTURAL MARKETPLACE'}
                </p>
                <h2 className="font-display text-2xl sm:text-4xl text-[#0D0D0D] leading-tight">
                  {websiteContent.aboutSectionTitle ||
                    'Where Caribbean & Coastal Architecture Meets Direct Discovery'}
                </h2>
                <p className="font-body text-sm sm:text-base text-[#737373] leading-relaxed">
                  {websiteContent.aboutSectionDescription}
                </p>
                {websiteContent.aboutSectionHighlights &&
                  websiteContent.aboutSectionHighlights.length > 0 && (
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {websiteContent.aboutSectionHighlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#1150EF] shrink-0 mt-0.5" />
                          <span className="font-ui text-xs font-semibold text-[#161616] leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-lg aspect-[4/3] bg-neutral-100">
                  <PropertyImage
                    src={websiteContent.heroVideoPoster || SCENEAI_IMAGES.latest1}
                    alt={websiteContent.aboutSectionTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          HOW IT WORKS & MARKETPLACE TRUST / SAFETY
      ====================================================================== */}
      {secVis.howItWorksAndTrust && (
        <section className="py-16 sm:py-20 bg-white border-t border-neutral-200/70">
          <div className="mdp-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* How It Works */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                    {isEn && websiteContent.howItWorksKicker
                      ? websiteContent.howItWorksKicker
                      : t.sections.howItWorksKicker}
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl text-[#0D0D0D] mt-1">
                    {isEn && websiteContent.howItWorksTitle
                      ? websiteContent.howItWorksTitle
                      : t.sections.howItWorks}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <span className="font-ui text-xs font-bold text-[#1150EF]">
                      {t.sections.step1Badge}
                    </span>
                    <h3 className="font-display text-lg text-[#0D0D0D] mt-2">
                      {isEn && websiteContent.howStep1Title
                        ? websiteContent.howStep1Title
                        : t.sections.step1Title}
                    </h3>
                    <p className="mt-2 font-body text-xs text-[#737373] leading-relaxed">
                      {isEn && websiteContent.howStep1Desc
                        ? websiteContent.howStep1Desc
                        : t.sections.step1Desc}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <span className="font-ui text-xs font-bold text-[#1150EF]">
                      {t.sections.step2Badge}
                    </span>
                    <h3 className="font-display text-lg text-[#0D0D0D] mt-2">
                      {isEn && websiteContent.howStep2Title
                        ? websiteContent.howStep2Title
                        : t.sections.step2Title}
                    </h3>
                    <p className="mt-2 font-body text-xs text-[#737373] leading-relaxed">
                      {isEn && websiteContent.howStep2Desc
                        ? websiteContent.howStep2Desc
                        : t.sections.step2Desc}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <span className="font-ui text-xs font-bold text-[#1150EF]">
                      {t.sections.step3Badge}
                    </span>
                    <h3 className="font-display text-lg text-[#0D0D0D] mt-2">
                      {isEn && websiteContent.howStep3Title
                        ? websiteContent.howStep3Title
                        : t.sections.step3Title}
                    </h3>
                    <p className="mt-2 font-body text-xs text-[#737373] leading-relaxed">
                      {isEn && websiteContent.howStep3Desc
                        ? websiteContent.howStep3Desc
                        : t.sections.step3Desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust and Safety Box */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#0D0D0D] text-white space-y-5">
                <div className="flex items-center gap-2.5 text-[#76A2FA]">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="font-ui text-xs font-bold uppercase tracking-widest">
                    {t.sections.trustAndSafety}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-white">
                  {isEn && websiteContent.trustSafetyTitle
                    ? websiteContent.trustSafetyTitle
                    : t.property.safetyTipsTitle}
                </h3>
                <ul className="space-y-3 font-body text-xs sm:text-sm text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#76A2FA] shrink-0 mt-0.5" />
                    <span>
                      {isEn && websiteContent.trustTip1
                        ? websiteContent.trustTip1
                        : t.property.safetyTip1}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#76A2FA] shrink-0 mt-0.5" />
                    <span>
                      {isEn && websiteContent.trustTip2
                        ? websiteContent.trustTip2
                        : t.property.safetyTip2}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#76A2FA] shrink-0 mt-0.5" />
                    <span>
                      {isEn && websiteContent.trustTip3
                        ? websiteContent.trustTip3
                        : t.property.safetyTip3}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          LIST YOUR PROPERTY CTA BANNER
      ====================================================================== */}
      {secVis.ownerCtaBanner && (
        <section
          style={
            branding.primaryColor
              ? {
                  backgroundImage: `linear-gradient(90deg, ${branding.primaryColor}, ${branding.secondaryColor || '#135AF3'}, #3c7af6)`
                }
              : undefined
          }
          className="py-16 bg-gradient-to-r from-[#1150EF] via-[#135AF3] to-[#3c7af6] text-white"
        >
          <div className="mdp-container flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#B9CFFD]">
                {isEn && websiteContent.ownerCtaKicker
                  ? websiteContent.ownerCtaKicker
                  : t.sections.ownerStudioKicker}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-white mt-2">
                {isEn && websiteContent.ownerCtaTitle
                  ? websiteContent.ownerCtaTitle
                  : t.sections.listPropertyCtaTitle}
              </h2>
              <p className="mt-3 font-body text-sm sm:text-base text-white/85">
                {isEn && websiteContent.ownerCtaDesc
                  ? websiteContent.ownerCtaDesc
                  : t.sections.listPropertyCtaDesc}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/list-property"
                className={`px-6 py-3.5 ${branding.buttonRadius || 'rounded-xl'} bg-white text-[#1150EF] hover:bg-neutral-100 font-ui text-sm font-bold inline-flex items-center gap-2 shadow-lg transition-colors`}
              >
                <span>{t.nav.listProperty}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard/owner"
                className={`px-5 py-3.5 ${branding.buttonRadius || 'rounded-xl'} bg-white/15 hover:bg-white/25 text-white font-ui text-sm font-semibold transition-colors`}
              >
                {t.nav.ownerDashboard}
              </Link>
            </div>
          </div>

          {/* Direct Contact Website Admin for Services Bar */}
          <div className="mdp-container mt-10 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* USA Call */}
              <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/15">
                <span className="block font-ui text-[10px] font-bold uppercase tracking-widest text-[#B9CFFD]">
                  Call Admin (From USA)
                </span>
                <a
                  href={`tel:${(websiteContent.supportPhone || '+14842082963').replace(/[^+\d]/g, '')}`}
                  className="mt-1.5 inline-flex items-center gap-2 font-ui text-base font-bold text-white hover:text-[#B9CFFD] transition-colors"
                >
                  <span>{websiteContent.supportPhone || '+1 (484) 208-2963'}</span>
                </a>
              </div>

              {/* WhatsApp Direct Lines */}
              <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/15">
                <span className="block font-ui text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  WhatsApp Direct (Admin Services)
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(
                    websiteContent.whatsappNumbers && websiteContent.whatsappNumbers.length > 0
                      ? websiteContent.whatsappNumbers
                      : ['+1 (829) 850-8107', '+1 (829) 876-8096', '+509 3999-4934']
                  ).map((waDisplay) => {
                    const digitsOnly = waDisplay.replace(/\D/g, '');
                    const waDigits =
                      digitsOnly.length === 10 &&
                      (digitsOnly.startsWith('809') ||
                        digitsOnly.startsWith('829') ||
                        digitsOnly.startsWith('849'))
                        ? `1${digitsOnly}`
                        : digitsOnly;
                    return (
                      <a
                        key={waDisplay}
                        href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                          'Hello MY DREAM PLACE Admin, I would like to inquire about your real estate services.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-300/30 font-ui text-xs font-semibold text-white transition-colors"
                      >
                        {waDisplay}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Email Admin for Services */}
              <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/15">
                <span className="block font-ui text-[10px] font-bold uppercase tracking-widest text-[#B9CFFD]">
                  Email Admin for Services
                </span>
                <div className="mt-1.5 space-y-1">
                  <a
                    href={`mailto:${websiteContent.supportEmail || 'jnscompany916@gmail.com'}`}
                    className="block font-ui text-xs font-semibold text-white hover:text-[#B9CFFD] break-all transition-colors"
                  >
                    {websiteContent.supportEmail || 'jnscompany916@gmail.com'}
                  </a>
                  {(websiteContent.secondarySupportEmail || 'contact.mc99haiti@gmail.com') && (
                    <a
                      href={`mailto:${websiteContent.secondarySupportEmail || 'contact.mc99haiti@gmail.com'}`}
                      className="block font-ui text-xs font-semibold text-white/90 hover:text-[#B9CFFD] break-all transition-colors"
                    >
                      {websiteContent.secondarySupportEmail || 'contact.mc99haiti@gmail.com'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
