import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Code2,
  Compass,
  Copy,
  Flag,
  Heart,
  Layers,
  MapPin,
  MessageCircle,
  Play,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { translateAmenity, translatePropertyText } from '../translations';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyImage } from '../components/PropertyImage';
import { InteractiveMapDemo } from '../components/InteractiveMapDemo';
import { ViewingRequest } from '../types';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    t,
    language,
    properties,
    publicProperties,
    owners,
    formatPrice,
    favorites,
    toggleFavorite,
    compareIds,
    toggleCompare,
    currentUser,
    createInquiry,
    createViewingRequest,
    reportProperty,
    showToast
  } = useMarketplace();

  const property = properties.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<'photos' | 'video' | 'tour360'>('photos');
  const [tourYaw, setTourYaw] = useState(50);

  // Contact & Viewing Modals
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [inquirySubmittedId, setInquirySubmittedId] = useState<string | null>(null);
  const [viewingSubmittedId, setViewingSubmittedId] = useState<string | null>(null);

  // Contact Owner Form State (Section 9)
  const [fullName, setFullName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [messageText, setMessageText] = useState(t.property.defaultInquiryMessage);

  // Viewing Request Form State
  const [preferredDate, setPreferredDate] = useState('2026-11-18');
  const [preferredTime, setPreferredTime] = useState('15:00');
  const [visitType, setVisitType] = useState<ViewingRequest['visitType']>('in_person');
  const [guestCount, setGuestCount] = useState<string>('150');
  const [viewingNotes, setViewingNotes] = useState('');

  // Report Form State
  const [reportReason, setReportReason] = useState('Inaccurate pricing or availability details');
  const [showSchemaPreview, setShowSchemaPreview] = useState(false);

  const owner = owners.find((o) => o.id === property?.ownerId) || owners[0];

  // Build Schema.org JSON-LD Structured Data for Luxury Real Estate Listing
  const schemaOrgData = React.useMemo(() => {
    if (!property) return null;

    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://mydreamplace.demo';
    const canonicalUrl = `${origin}/property/${property.id}`;

    const accommodationType =
      property.category === 'house' || property.category === 'villa'
        ? 'SingleFamilyResidence'
        : property.category === 'apartment'
        ? 'Apartment'
        : property.category === 'event_space'
        ? 'EventVenue'
        : 'Place';

    const categoryCollectionPath =
      property.listingType === 'sale'
        ? '/buy'
        : property.listingType === 'rent'
        ? '/rent'
        : property.listingType === 'land'
        ? '/land'
        : '/events';

    const externalImages = property.images.filter((img) => img.startsWith('http'));

    const mainEntityData: Record<string, unknown> = {
      '@type': accommodationType,
      '@id': `${canonicalUrl}#place`,
      name: property.title,
      description: property.subtitle || property.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.location.address,
        addressLocality: property.location.city,
        addressRegion: property.location.neighborhood,
        addressCountry: property.location.country
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.location.coordinates.lat,
        longitude: property.location.coordinates.lng
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.specs.areaSqm,
        unitCode: 'MTK',
        unitText: 'm²'
      },
      amenityFeature: property.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
        value: true
      }))
    };

    if (property.specs.bedrooms !== undefined) {
      mainEntityData.numberOfBedrooms = property.specs.bedrooms;
      mainEntityData.numberOfRooms = property.specs.bedrooms;
    }
    if (property.specs.bathrooms !== undefined) {
      mainEntityData.numberOfBathroomsTotal = property.specs.bathrooms;
    }
    if (property.specs.guestCapacity !== undefined) {
      mainEntityData.maximumAttendeeCapacity = property.specs.guestCapacity;
    }
    if (property.specs.yearBuilt !== undefined) {
      mainEntityData.yearBuilt = property.specs.yearBuilt;
    }

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['RealEstateListing', 'Product'],
          '@id': `${canonicalUrl}#listing`,
          name: property.title,
          headline: property.subtitle || property.title,
          description: property.description,
          sku: property.referenceCode,
          identifier: property.referenceCode,
          url: canonicalUrl,
          datePosted: property.dateListed,
          image: externalImages.length > 0 ? externalImages : undefined,
          brand: {
            '@type': 'Brand',
            name: 'MY DREAM PLACE — Real Estate',
            slogan: "Find the place you've always dreamed of."
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            price: property.priceUSD,
            priceCurrency: 'USD',
            availability:
              property.approvalStatus === 'approved'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/PreOrder',
            validFrom: property.dateListed,
            businessFunction:
              property.listingType === 'rent' || property.listingType === 'event'
                ? 'http://purl.org/goodrelations/v1#LeaseOut'
                : 'http://purl.org/goodrelations/v1#Sell',
            seller: {
              '@type': 'RealEstateAgent',
              name: owner.name,
              jobTitle: owner.roleTitle,
              email: owner.email,
              telephone: owner.phone,
              knowsLanguage: owner.languages
            }
          },
          mainEntity: mainEntityData
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'MY DREAM PLACE — Real Estate',
              item: `${origin}/`
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: t.categories[property.category],
              item: `${origin}${categoryCollectionPath}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: property.title,
              item: canonicalUrl
            }
          ]
        }
      ]
    };
  }, [property, owner, t.categories]);

  // Synchronize document title, OpenGraph/Twitter meta tags, canonical link, and JSON-LD in <head>
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setMediaMode('photos');
    setInquirySubmittedId(null);
    setViewingSubmittedId(null);
    setMessageText(t.property.defaultInquiryMessage);

    if (!property || !schemaOrgData) return;

    const prevTitle = document.title;
    const seoTitle = `${property.title} (${property.location.city}) | MY DREAM PLACE`;
    const seoDesc = `${property.title} in ${property.location.neighborhood}, ${property.location.city}. ${property.description.slice(0, 110)}...`;
    const canonicalHref = `${window.location.origin}${window.location.pathname}`;

    document.title = seoTitle;

    const setMetaContent = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaContent('meta[name="description"]', 'name', 'description', seoDesc);
    setMetaContent('meta[property="og:title"]', 'property', 'og:title', seoTitle);
    setMetaContent('meta[property="og:description"]', 'property', 'og:description', seoDesc);
    setMetaContent('meta[property="og:url"]', 'property', 'og:url', canonicalHref);
    setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', seoTitle);
    setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', seoDesc);

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalHref);

    let scriptEl = document.getElementById('mdp-property-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'mdp-property-schema-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaOrgData, null, 2);

    return () => {
      document.title = prevTitle;
      const existingScript = document.getElementById('mdp-property-schema-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [id, property, schemaOrgData, t.property.defaultInquiryMessage]);

  if (!property) {
    return (
      <div className="py-20 mdp-container text-center">
        <h1 className="font-display text-3xl text-[#0D0D0D]">{t.property.notFoundTitle}</h1>
        <p className="mt-2 font-body text-sm text-[#737373]">
          {t.property.notFoundDesc}
        </p>
        <Link
          to="/buy"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.backToListings}</span>
        </Link>
      </div>
    );
  }

  const localizedProp = translatePropertyText(property.id, language, property);
  const isFavorite = favorites.includes(property.id);
  const isCompared = compareIds.includes(property.id);

  // Category-aware primary & secondary CTA labels (Section 11)
  const primaryContactLabel =
    property.listingType === 'land'
      ? t.property.contactSeller
      : property.listingType === 'event'
      ? t.property.contactVenue
      : t.property.contactOwner;

  const secondaryActionLabel =
    property.listingType === 'land'
      ? t.property.requestMoreDetails
      : property.listingType === 'event'
      ? t.property.askAvailability
      : t.property.requestViewing;

  const similarProperties = publicProperties
    .filter((p) => p.id !== property.id && (p.category === property.category || p.listingType === property.listingType))
    .slice(0, 3);

  const whatsappUrl = owner.whatsapp
    ? `https://wa.me/${owner.whatsapp}?text=${encodeURIComponent(
        `Hello ${owner.name}, I am viewing "${localizedProp.title}" (Ref: ${property.referenceCode}) on MY DREAM PLACE — Real Estate. ${messageText}`
      )}`
    : null;

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    showToast(`${t.common.copiedLink} (${property.referenceCode})`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createInquiry({
      propertyId: property.id,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      message: messageText
    });
    setInquirySubmittedId(created.id);
  };

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createViewingRequest({
      propertyId: property.id,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      preferredDate,
      preferredTime,
      visitType,
      guestCount: property.listingType === 'event' ? Number(guestCount) : undefined,
      notes: viewingNotes
    });
    setViewingSubmittedId(created.id);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportProperty(property.id, reportReason);
    setReportModalOpen(false);
  };

  return (
    <div className="py-8 sm:py-12 pb-28 md:pb-16 bg-neutral-50 min-h-screen">
      {/* Schema.org JSON-LD Structured Data for Search Engine Visibility */}
      {schemaOrgData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
        />
      )}
      <div className="mdp-container space-y-8">
        {/* Top Breadcrumb & Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-ui text-xs font-semibold text-[#161616] hover:text-[#1150EF] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.backToListings}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(property.id)}
              className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold inline-flex items-center gap-1.5 border cursor-pointer transition-colors ${
                isFavorite
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-[#161616] border-neutral-200 hover:border-[#1150EF]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? t.property.saved : t.property.saveFavorite}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleCompare(property.id)}
              className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold inline-flex items-center gap-1.5 border cursor-pointer transition-colors ${
                isCompared
                  ? 'bg-[#1150EF] text-white border-[#1150EF]'
                  : 'bg-white text-[#161616] border-neutral-200 hover:border-[#1150EF]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isCompared ? t.property.compareAdded : t.property.compareAdd}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:border-[#1150EF] font-ui text-xs font-semibold text-[#161616] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.property.shareProperty}</span>
            </button>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:border-rose-400 font-ui text-xs font-medium text-[#737373] hover:text-rose-600 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.property.reportListing}</span>
            </button>
          </div>
        </div>

        {/* Pending Approval Banner (if owner/admin is previewing an unapproved property) */}
        {property.approvalStatus !== 'approved' && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-ui text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong className="uppercase">{property.approvalStatus}</strong> —{' '}
                {t.property.moderationBannerText}
              </span>
            </div>
            <Link
              to="/dashboard/admin"
              className="px-3 py-1.5 rounded-lg bg-amber-900 text-white font-ui text-xs font-semibold"
            >
              {t.property.reviewInAdminBtn}
            </Link>
          </div>
        )}

        {/* Gallery & Media Showcase Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-neutral-200/90 space-y-4">
          {/* Media Mode Switcher: Photos / Video / 360 Virtual Tour */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-ui text-[#737373]">
              <span className="font-bold uppercase tracking-wider text-[#1150EF]">
                {t.categories[property.category]}
              </span>
              <span>·</span>
              <span className="tabular-nums">
                {t.property.reference}: <strong>{property.referenceCode}</strong>
              </span>
              <span>·</span>
              <span className="tabular-nums">
                {t.property.listedOn}: {property.dateListed}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMediaMode('photos')}
                className={`px-3 py-1.5 rounded-lg font-ui text-xs font-semibold cursor-pointer ${
                  mediaMode === 'photos'
                    ? 'bg-white text-[#1150EF] shadow-2xs'
                    : 'text-[#737373]'
                }`}
              >
                {t.property.photosTab} ({property.images.length})
              </button>
              {property.videoUrl && (
                <button
                  type="button"
                  onClick={() => setMediaMode('video')}
                  className={`px-3 py-1.5 rounded-lg font-ui text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                    mediaMode === 'video'
                      ? 'bg-white text-[#1150EF] shadow-2xs'
                      : 'text-[#737373]'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{t.property.cinemaReelTab}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setMediaMode('tour360')}
                className={`px-3 py-1.5 rounded-lg font-ui text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  mediaMode === 'tour360'
                    ? 'bg-white text-[#1150EF] shadow-2xs'
                    : 'text-[#737373]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t.property.virtualTour}</span>
              </button>
            </div>
          </div>

          {/* Media Viewport */}
          {mediaMode === 'photos' && (
            <div className="space-y-3">
              <div className="relative aspect-[16/9] max-h-[540px] w-full rounded-xl overflow-hidden bg-neutral-100">
                <PropertyImage
                  src={property.images[activeImageIndex] || property.images[0]}
                  alt={`${localizedProp.title} — ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {property.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {property.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#1150EF] scale-[1.02]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <PropertyImage
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {mediaMode === 'video' && property.videoUrl && (
            <div className="relative aspect-[16/9] max-h-[540px] w-full rounded-xl overflow-hidden bg-black">
              <video
                src={property.videoUrl}
                poster={property.images[0]}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {mediaMode === 'tour360' && (
            <div className="relative aspect-[16/9] max-h-[540px] w-full rounded-xl overflow-hidden bg-[#0D0D0D] select-none">
              <div
                style={{
                  transform: `scale(1.22) translateX(${(50 - tourYaw) * 0.25}%)`
                }}
                className="w-full h-full transition-transform duration-150"
              >
                <PropertyImage
                  src={property.images[activeImageIndex] || property.images[0]}
                  alt={t.property.virtualTour}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 flex flex-col justify-between p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xs font-ui text-xs font-semibold inline-flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#76A2FA]" />
                    {t.property.virtualTour}
                  </span>
                  <span className="font-ui text-xs tabular-nums bg-black/50 px-2.5 py-1 rounded">
                    Yaw: {Math.round(tourYaw * 3.6)}°
                  </span>
                </div>

                <div className="max-w-md mx-auto w-full bg-black/65 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                  <label className="block font-ui text-[11px] text-white/85 mb-1.5 text-center">
                    {t.property.drag360Hint}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={tourYaw}
                    onChange={(e) => setTourYaw(Number(e.target.value))}
                    className="w-full accent-[#1150EF] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Two-Column Contiguous Property & Direct Consultation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: Specifications, Description, Amenities, Map */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            {/* Title, Location, Price & Core Specs */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-4xl text-[#0D0D0D]">
                    {localizedProp.title}
                  </h1>
                  {localizedProp.subtitle && (
                    <p className="mt-1.5 font-body text-sm sm:text-base text-[#737373]">
                      {localizedProp.subtitle}
                    </p>
                  )}
                  <p className="mt-2.5 flex items-center gap-1.5 font-body text-xs sm:text-sm text-[#161616]">
                    <MapPin className="w-4 h-4 text-[#1150EF] shrink-0" />
                    <span>
                      {property.location.address} — {property.location.neighborhood},{' '}
                      {property.location.city}, {property.location.country}
                    </span>
                  </p>
                </div>

                <div className="md:text-right shrink-0">
                  <div className="font-ui text-2xl sm:text-3xl font-bold text-[#1150EF] tabular-nums">
                    {formatPrice(property.priceUSD, property.priceUnit)}
                  </div>
                  <div className="font-ui text-[11px] text-[#737373] mt-0.5">
                    {t.property.noOnlineCheckoutNotice}
                  </div>
                </div>
              </div>

              {/* Key Architectural Metrics Bar */}
              <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-neutral-50">
                  <div className="font-ui text-[11px] text-[#737373] uppercase">
                    {t.property.interiorTotalArea}
                  </div>
                  <div className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums mt-0.5">
                    {property.specs.areaSqm.toLocaleString()} {t.property.area}
                  </div>
                </div>

                {property.specs.bedrooms !== undefined && (
                  <div className="p-3.5 rounded-xl bg-neutral-50">
                    <div className="font-ui text-[11px] text-[#737373] uppercase">
                      {t.search.bedrooms}
                    </div>
                    <div className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums mt-0.5">
                      {property.specs.bedrooms} {t.property.beds}
                    </div>
                  </div>
                )}

                {property.specs.bathrooms !== undefined && (
                  <div className="p-3.5 rounded-xl bg-neutral-50">
                    <div className="font-ui text-[11px] text-[#737373] uppercase">
                      {t.property.bathroomsLabel}
                    </div>
                    <div className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums mt-0.5">
                      {property.specs.bathrooms} {t.property.baths}
                    </div>
                  </div>
                )}

                {property.specs.lotSizeSqm !== undefined && (
                  <div className="p-3.5 rounded-xl bg-neutral-50">
                    <div className="font-ui text-[11px] text-[#737373] uppercase">
                      {t.property.landLotArea}
                    </div>
                    <div className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums mt-0.5">
                      {property.specs.lotSizeSqm.toLocaleString()} {t.property.area}
                    </div>
                  </div>
                )}

                {property.specs.guestCapacity !== undefined && (
                  <div className="p-3.5 rounded-xl bg-neutral-50">
                    <div className="font-ui text-[11px] text-[#737373] uppercase">
                      {t.search.guestCapacity}
                    </div>
                    <div className="font-ui text-lg font-bold text-[#0D0D0D] tabular-nums mt-0.5">
                      {t.property.upToGuests} {property.specs.guestCapacity} {t.search.guestsPlus}
                    </div>
                  </div>
                )}

                {property.specs.zoningType && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 col-span-2">
                    <div className="font-ui text-[11px] text-[#737373] uppercase">
                      {t.property.approvedZoning}
                    </div>
                    <div className="font-ui text-sm font-bold text-[#0D0D0D] mt-0.5">
                      {property.specs.zoningType}
                    </div>
                  </div>
                )}
              </div>

              {/* Narrative Description & Architectural Highlights */}
              <div className="pt-6 border-t border-neutral-100 space-y-4">
                <h2 className="font-display text-xl text-[#0D0D0D]">
                  {t.property.overviewSpecsTitle}
                </h2>
                <p className="font-body text-sm sm:text-base text-[#161616]/85 leading-relaxed">
                  {localizedProp.description}
                </p>

                {property.highlights.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <h3 className="font-ui text-xs font-bold uppercase tracking-wider text-[#737373]">
                      {t.property.highlightsTitle}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {property.highlights.map((hl, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 font-body text-xs sm:text-sm text-[#161616]"
                        >
                          <Sparkles className="w-4 h-4 text-[#1150EF] shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Event Space Specific Guidelines or Land Specific Details */}
              {property.listingType === 'event' && property.specs.eventRestrictions && (
                <div className="pt-6 border-t border-neutral-100 space-y-3">
                  <h3 className="font-display text-lg text-[#0D0D0D] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1150EF]" />
                    <span>{t.property.eventGuidelinesTitle}</span>
                  </h3>
                  <div className="text-xs font-ui text-[#737373]">
                    {t.property.supportedFormatsLabel}:{' '}
                    <strong className="text-[#161616] uppercase">
                      {property.specs.eventTypesSupported?.join(' · ') || 'All Private & Corporate Events'}
                    </strong>
                  </div>
                  <ul className="space-y-1.5 font-body text-xs sm:text-sm text-[#161616]">
                    {property.specs.eventRestrictions.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1150EF] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {property.listingType === 'land' && (
                <div className="pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-ui">
                  <div className="p-4 rounded-xl bg-neutral-50">
                    <span className="text-[#737373] block uppercase">
                      {t.property.topographyLabel}
                    </span>
                    <strong className="text-[#0D0D0D] text-sm mt-1 block">
                      {property.specs.topography || 'Surveyed & Staked'}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50">
                    <span className="text-[#737373] block uppercase">
                      {t.property.utilitiesLabel}
                    </span>
                    <strong className="text-[#0D0D0D] text-sm mt-1 block">
                      {property.specs.utilitiesAvailable?.join(' · ') || 'Road & Power at Boundary'}
                    </strong>
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div className="pt-6 border-t border-neutral-100">
                <h2 className="font-display text-xl text-[#0D0D0D] mb-4">
                  {t.property.amenitiesTitle}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 font-ui text-xs font-medium text-[#161616]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1150EF] shrink-0" />
                      <span>{translateAmenity(amenity, language)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spatial Map Preview */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 space-y-4">
              <h2 className="font-display text-2xl text-[#0D0D0D]">
                {t.property.mapPreview}
              </h2>
              <InteractiveMapDemo
                properties={[property, ...similarProperties]}
                selectedPropertyId={property.id}
                heightClass="h-[360px]"
              />
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Sticky Direct Owner Consultation & Safety Box */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Verified Owner / Agent Card & Direct Actions */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-md space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1150EF] text-white font-display text-lg font-bold flex items-center justify-center shrink-0">
                    {owner.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-ui font-bold text-emerald-700 uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.property.verifiedOwner}</span>
                    </div>
                    <h3 className="font-display text-lg text-[#0D0D0D]">{owner.name}</h3>
                    <p className="font-body text-xs text-[#737373]">{owner.roleTitle}</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 space-y-1.5 text-xs font-ui">
                <div className="flex justify-between">
                  <span className="text-[#737373]">{t.property.responseRateLabel}</span>
                  <span className="font-bold text-[#0D0D0D] tabular-nums">{owner.responseRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">{t.property.typicalResponseLabel}</span>
                  <span className="font-semibold text-[#0D0D0D]">{owner.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">{t.property.languagesLabel}</span>
                  <span className="font-medium text-[#0D0D0D]">{owner.languages.join(', ')}</span>
                </div>
              </div>

              {/* Primary Marketplace Action Buttons (No Instant Checkout — Section 9 & 11) */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setInquirySubmittedId(null);
                    setContactModalOpen(true);
                  }}
                  className="w-full h-12 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>{primaryContactLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewingSubmittedId(null);
                    setViewingModalOpen(true);
                  }}
                  className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-ui text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{secondaryActionLabel}</span>
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.property.whatsappOwner}</span>
                  </a>
                )}
              </div>

              <p className="text-[11px] font-body text-[#737373] text-center leading-relaxed">
                {t.property.noOnlineCheckoutNotice}
              </p>
            </div>

            {/* Safety & Trust Box (Section 13) */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-3">
              <div className="flex items-center gap-2 text-xs font-ui font-bold uppercase tracking-wider text-[#1150EF]">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.property.safetyTipsTitle}</span>
              </div>
              <ul className="space-y-2 text-xs font-body text-[#737373] leading-relaxed">
                <li>• {t.property.safetyTip1}</li>
                <li>• {t.property.safetyTip2}</li>
                <li>• {t.property.safetyTip3}</li>
              </ul>
            </div>

            {/* Schema.org Structured Data Verification Card */}
            {schemaOrgData && (
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-ui font-bold uppercase tracking-wider text-[#0D0D0D]">
                    <Code2 className="w-4 h-4 text-[#1150EF]" />
                    <span>{t.property.schemaActiveTitle}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard
                            .writeText(JSON.stringify(schemaOrgData, null, 2))
                            .catch(() => {});
                        }
                        showToast('Schema.org JSON-LD copied to clipboard');
                      }}
                      title={t.property.copyBtn}
                      className="px-2 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-ui text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{t.property.copyBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSchemaPreview((prev) => !prev)}
                      className="px-2.5 py-1 rounded-md bg-[#1150EF]/10 hover:bg-[#1150EF]/20 text-[#1150EF] font-ui text-[11px] font-semibold cursor-pointer"
                    >
                      {showSchemaPreview ? t.property.hideBtn : t.property.inspectBtn}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] font-body text-[#737373] leading-relaxed">
                  {t.property.schemaDesc}
                </p>
                {showSchemaPreview && (
                  <pre className="p-3 rounded-xl bg-[#0D0D0D] text-[#B9CFFD] font-mono text-[10px] leading-relaxed overflow-x-auto max-h-60">
                    {JSON.stringify(schemaOrgData, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-8 border-t border-neutral-200">
            <h2 className="font-display text-2xl sm:text-3xl text-[#0D0D0D] mb-6">
              {t.property.similarProperties}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((sim) => (
                <PropertyCard key={sim.id} property={sim} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          SECTION 11: MOBILE-FIRST STICKY BOTTOM ACTION BAR
      ====================================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => {
              setInquirySubmittedId(null);
              setContactModalOpen(true);
            }}
            className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-bold text-center cursor-pointer"
          >
            {primaryContactLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setViewingSubmittedId(null);
              setViewingModalOpen(true);
            }}
            className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl bg-[#0D0D0D] text-white font-ui text-xs font-semibold text-center cursor-pointer"
          >
            {secondaryActionLabel}
          </button>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: CONTACT OWNER / SELLER / VENUE FORM (SECTION 9)
      ====================================================================== */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.modals.contactTitle}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-[#0D0D0D]">
                  {primaryContactLabel}
                </h2>
                <p className="text-xs font-ui text-[#737373]">
                  {localizedProp.title} ({property.referenceCode})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inquirySubmittedId ? (
              <div className="p-6 space-y-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl text-[#0D0D0D]">
                  {t.modals.inquirySavedHeading}
                </h3>
                <p className="font-body text-sm text-[#737373]">
                  {t.modals.inquirySentSuccess}
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <Link
                    to="/dashboard/customer?tab=inquiries"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-semibold"
                  >
                    {t.modals.viewCustomerDashBtn}
                  </Link>
                  <Link
                    to="/dashboard/owner?tab=inquiries"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 text-[#161616] font-ui text-xs font-semibold"
                  >
                    {t.modals.simulateOwnerReplyBtn}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.fullName}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.phoneOptional}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.propertyRef}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={property.referenceCode}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-100 text-sm font-ui text-[#737373] tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.message}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    {t.modals.sendInquiry}
                  </button>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.property.whatsappOwner}</span>
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-ui">
                  <span className="text-[#737373]">{t.modals.preferWalkthroughPrompt}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setContactModalOpen(false);
                      setViewingModalOpen(true);
                    }}
                    className="text-[#1150EF] font-semibold hover:underline cursor-pointer"
                  >
                    {secondaryActionLabel} →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: REQUEST VIEWING / AVAILABILITY CONSULTATION
      ====================================================================== */}
      {viewingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.modals.viewingTitle}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-[#0D0D0D]">
                  {secondaryActionLabel}
                </h2>
                <p className="text-xs font-ui text-[#737373]">
                  {localizedProp.title} ({property.referenceCode})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewingSubmittedId ? (
              <div className="p-6 space-y-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl text-[#0D0D0D]">
                  {t.modals.viewingLoggedHeading}
                </h3>
                <p className="font-body text-sm text-[#737373]">
                  {t.modals.viewingSentSuccess}
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to="/dashboard/customer?tab=viewings"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-semibold"
                  >
                    {t.modals.customerScheduleBtn}
                  </Link>
                  <Link
                    to="/dashboard/owner?tab=viewings"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 text-[#161616] font-ui text-xs font-semibold"
                  >
                    {t.modals.confirmAsOwnerBtn}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleViewingSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.preferredDate}
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.preferredTime}
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:30">4:30 PM (Sunset Slot)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.visitType}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'in_person', label: t.modals.inPerson },
                      { id: 'video_call', label: t.modals.videoCall },
                      { id: 'event_inspection', label: t.modals.eventInspection }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setVisitType(opt.id as ViewingRequest['visitType'])}
                        className={`py-2 px-3 rounded-xl font-ui text-xs font-semibold border cursor-pointer ${
                          visitType === opt.id
                            ? 'bg-[#1150EF] text-white border-[#1150EF]'
                            : 'bg-neutral-50 text-[#161616] border-neutral-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.fullName}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.phoneRequired}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                </div>

                {property.listingType === 'event' && (
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.estimatedGuestsLabel}
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.viewingNotesLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={viewingNotes}
                    onChange={(e) => setViewingNotes(e.target.value)}
                    placeholder={t.modals.viewingNotesPlaceholder}
                    className="w-full p-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-sm font-bold cursor-pointer"
                >
                  {t.modals.submitViewing}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: REPORT LISTING
      ====================================================================== */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-[#0D0D0D]">
                {t.property.reportListing} ({property.referenceCode})
              </h3>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1.5">
                  {t.modals.reportReasonLabel}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                >
                  <option value="Inaccurate pricing or availability details">
                    Inaccurate pricing or availability details
                  </option>
                  <option value="Duplicate listing or incorrect photos">
                    Duplicate listing or incorrect photos
                  </option>
                  <option value="Unresponsive owner contact number">
                    Unresponsive owner contact number
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-ui text-xs font-bold cursor-pointer"
              >
                {t.modals.submitReportBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
