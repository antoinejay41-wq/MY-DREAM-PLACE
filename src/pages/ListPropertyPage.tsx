import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarHeart,
  CheckCircle2,
  ExternalLink,
  Home,
  ImagePlus,
  Landmark,
  MapPin,
  ShieldCheck,
  Trees,
  Upload
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import {
  EventType,
  ListingType,
  Property,
  PropertyCategory,
  RentalDuration
} from '../types';
import { SCENEAI_IMAGES } from '../data/mockData';
import { PropertyImage } from '../components/PropertyImage';
import { InteractiveMapDemo } from '../components/InteractiveMapDemo';
import {
  VERIFIED_CITY_REFERENCES,
  buildGoogleMapsLocationUrl,
  findCityReference,
  validatePropertyLocation
} from '../utils/locationUtils';

export const ListPropertyPage: React.FC = () => {
  const { t, currentUser, submitNewProperty, formatPrice, uploadMediaFromDevice } =
    useMarketplace();

  const [step, setStep] = useState<number>(1);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Step 1: Category
  const [category, setCategory] = useState<PropertyCategory>('villa');
  // Step 2: Transaction Type
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [rentalDuration, setRentalDuration] = useState<RentalDuration>('long_term');

  // Step 3: Location (Task 1 & Task 4 — Complete location fields + coordinates + accuracy)
  const [country, setCountry] = useState('Dominican Republic');
  const [province, setProvince] = useState('La Altagracia');
  const [city, setCity] = useState('Cap Cana');
  const [neighborhood, setNeighborhood] = useState('Playa Juanillo');
  const [address, setAddress] = useState('22 Boulevard de la Costa, Cap Cana');
  const [latInput, setLatInput] = useState<string>('18.5000');
  const [lngInput, setLngInput] = useState<string>('-68.3895');
  const [locationAccuracy, setLocationAccuracy] = useState<'approximate' | 'exact'>('approximate');

  // Step 4: Specifications (including Land & Event Venue specific fields)
  const [areaSqm, setAreaSqm] = useState<number>(520);
  const [lotSizeSqm, setLotSizeSqm] = useState<number>(1400);
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(5);
  const [parkingSpaces, setParkingSpaces] = useState<number>(3);
  const [furnished, setFurnished] = useState<boolean>(true);
  // Land specific
  const [zoningType, setZoningType] = useState('Residential / Boutique Hospitality');
  const [topography, setTopography] = useState('Flat coastal terrace with panoramic exposure');
  const [roadAccess, setRoadAccess] = useState(true);
  // Event Space specific
  const [guestCapacity, setGuestCapacity] = useState<number>(250);
  const [indoorOutdoor, setIndoorOutdoor] = useState<'indoor' | 'outdoor' | 'both'>('both');
  const [eventRestrictions, setEventRestrictions] = useState(
    'Sound system transitions indoors after midnight; valet parking included'
  );

  // Step 5: Images
  const [images, setImages] = useState<string[]>([
    SCENEAI_IMAGES.latest1,
    SCENEAI_IMAGES.heroMain
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Step 6: Pricing
  const [priceUSD, setPriceUSD] = useState<number>(1750000);
  const [priceUnit, setPriceUnit] = useState<Property['priceUnit']>('total');

  // Step 7: Description & Highlights
  const [title, setTitle] = useState('Villa Horizon d’Azur — Private Coastal Estate');
  const [subtitle, setSubtitle] = useState(
    'Contemporary architectural residence with infinity lap pool and ocean views'
  );
  const [description, setDescription] = useState(
    'Crafted with floor-to-ceiling architectural glass, natural coralina stone, and a zero-edge infinity terrace. Features full solar-battery autonomy and lush tropical gardens.'
  );
  const [amenitiesInput, setAmenitiesInput] = useState(
    'Infinity Pool, Ocean View, Solar Power, Smart Home, Gated Security, Furnished'
  );

  // Step 8: Owner Contact Details
  const [ownerName, setOwnerName] = useState(currentUser.name);
  const [ownerEmail, setOwnerEmail] = useState(currentUser.email);
  const [ownerPhone, setOwnerPhone] = useState(currentUser.phone);

  const stepsList = [
    { num: 1, label: t.wizard.step1Short },
    { num: 2, label: t.wizard.step2Short },
    { num: 3, label: t.wizard.step3Short },
    { num: 4, label: t.wizard.step4Short },
    { num: 5, label: t.wizard.step5Short },
    { num: 6, label: t.wizard.step6Short },
    { num: 7, label: t.wizard.step7Short },
    { num: 8, label: t.wizard.step8Short },
    { num: 9, label: t.wizard.step9Short }
  ];

  // Parse coordinates safely without falling back to an unrelated city
  const parsedCoordinates = React.useMemo(() => {
    const trimmedLat = latInput.trim();
    const trimmedLng = lngInput.trim();
    if (!trimmedLat || !trimmedLng) return null;
    const lat = Number(trimmedLat);
    const lng = Number(trimmedLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }, [latInput, lngInput]);

  const draftLocation: Property['location'] = React.useMemo(
    () => ({
      country: country.trim(),
      province: province.trim() || undefined,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      coordinates: parsedCoordinates,
      locationAccuracy
    }),
    [country, province, city, neighborhood, address, parsedCoordinates, locationAccuracy]
  );

  const locationValidation = React.useMemo(
    () => validatePropertyLocation(draftLocation),
    [draftLocation]
  );

  const previewPropertyObject: Property = React.useMemo(
    () => ({
      id: 'draft-owner-preview',
      referenceCode: 'MDP-PREVIEW',
      title: title.trim() || 'Draft Architectural Listing',
      subtitle: subtitle.trim(),
      category,
      listingType,
      priceUSD: Number(priceUSD) || 100000,
      priceUnit,
      rentalDuration: listingType === 'rent' ? rentalDuration : undefined,
      location: draftLocation,
      specs: {
        areaSqm: Number(areaSqm) || 250,
        lotSizeSqm: Number(lotSizeSqm) || undefined,
        bedrooms: category !== 'land' && category !== 'event_space' ? Number(bedrooms) : undefined,
        bathrooms: category !== 'land' && category !== 'event_space' ? Number(bathrooms) : undefined,
        parkingSpaces: Number(parkingSpaces) || 2,
        furnished
      },
      description,
      highlights: [`${neighborhood}, ${city}`],
      amenities: amenitiesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      images: images.length > 0 ? images : [SCENEAI_IMAGES.latest1],
      ownerId: 'own-1',
      approvalStatus: 'pending',
      availabilityStatus: 'available',
      featured: false,
      dateListed: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      inquiriesCount: 0
    }),
    [
      title,
      subtitle,
      category,
      listingType,
      priceUSD,
      priceUnit,
      rentalDuration,
      draftLocation,
      areaSqm,
      lotSizeSqm,
      bedrooms,
      bathrooms,
      parkingSpaces,
      furnished,
      description,
      neighborhood,
      city,
      amenitiesInput,
      images
    ]
  );

  const handleApplyCityPreset = (presetCity: string, presetCountry: string) => {
    const ref = findCityReference(presetCity, presetCountry);
    if (!ref) return;
    setCity(ref.city);
    setProvince(ref.province);
    setCountry(ref.country);
    setLatInput(ref.lat.toFixed(4));
    setLngInput(ref.lng.toFixed(4));
    setLocationAccuracy(ref.defaultAccuracy);
    if (ref.city === 'Cap Cana') {
      setNeighborhood('Playa Juanillo');
      setAddress('Cap Cana Resort District');
    } else if (ref.city === 'Punta Cana') {
      setNeighborhood('Los Corales — Bávaro');
      setAddress('Avenida Alemania, Bávaro, Punta Cana');
    } else if (ref.city === 'Santo Domingo') {
      setNeighborhood('Piantini');
      setAddress('Calle Federico Geraldino, Piantini');
    } else if (ref.city === 'Port-au-Prince') {
      setNeighborhood('Bourdon');
      setAddress('Rue Mercier, Bourdon, Port-au-Prince');
    } else if (ref.city === 'Pétion-Ville') {
      setNeighborhood('Morne Calvaire');
      setAddress('Rue Borno, Pétion-Ville');
    }
  };

  const handleCategorySelect = (cat: PropertyCategory) => {
    setCategory(cat);
    if (cat === 'land') {
      setListingType('land');
      setPriceUnit('total');
    } else if (cat === 'event_space') {
      setListingType('event');
      setPriceUnit('per_day');
      setPriceUSD(3500);
    } else if (listingType === 'land' || listingType === 'event') {
      setListingType('sale');
      setPriceUnit('total');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploadingImage(true);
    try {
      const asset = await uploadMediaFromDevice(file, 'property', 'Owner Listing Wizard');
      if (asset?.url) {
        setImages((prev) => [asset.url, ...prev]);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleFinalSubmit = () => {
    const amenities = amenitiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created = submitNewProperty({
      title: title.trim() || 'Untitled Architectural Listing',
      subtitle: subtitle.trim(),
      category,
      listingType,
      priceUSD: Number(priceUSD) || 100000,
      priceUnit,
      rentalDuration: listingType === 'rent' ? rentalDuration : undefined,
      location: draftLocation,
      specs: {
        areaSqm: Number(areaSqm) || 250,
        lotSizeSqm: Number(lotSizeSqm) || undefined,
        bedrooms:
          category !== 'land' && category !== 'event_space' ? Number(bedrooms) : undefined,
        bathrooms:
          category !== 'land' && category !== 'event_space' ? Number(bathrooms) : undefined,
        parkingSpaces: Number(parkingSpaces) || 2,
        furnished,
        zoningType: category === 'land' ? zoningType : undefined,
        topography: category === 'land' ? topography : undefined,
        roadAccess: category === 'land' ? roadAccess : undefined,
        guestCapacity: category === 'event_space' ? Number(guestCapacity) : undefined,
        indoorOutdoor: category === 'event_space' ? indoorOutdoor : undefined,
        eventTypesSupported:
          category === 'event_space'
            ? (['wedding', 'corporate', 'birthday', 'private'] as EventType[])
            : undefined,
        eventRestrictions:
          category === 'event_space'
            ? eventRestrictions.split(';').map((s) => s.trim()).filter(Boolean)
            : undefined
      },
      description,
      highlights: [
        `${t.wizard.submittedByLabel} ${ownerName} (${ownerPhone})`,
        `${neighborhood}, ${city}${province ? `, ${province}` : ''}`
      ],
      amenities,
      images: images.length > 0 ? images : [SCENEAI_IMAGES.latest1],
      ownerId: 'own-1',
      agentId: 'own-1',
      featured: false
    });

    setSubmittedProperty(created);
  };

  if (submittedProperty) {
    return (
      <div className="py-16 bg-neutral-50 min-h-screen">
        <div className="mdp-container max-w-3xl">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-neutral-200 shadow-lg text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-md">
                {t.wizard.successStatusBadge} ({submittedProperty.referenceCode})
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mt-3">
                {t.wizard.successTitle}
              </h1>
              <p className="mt-2 font-body text-sm sm:text-base text-[#737373]">
                “{submittedProperty.title}” — {t.wizard.successDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <Link
                to={`/property/${submittedProperty.id}`}
                className="py-3 px-4 rounded-xl border border-neutral-300 font-ui text-xs font-semibold text-[#161616] hover:bg-neutral-50"
              >
                {t.wizard.previewListingBtn}
              </Link>
              <Link
                to="/dashboard/owner?tab=pending"
                className="py-3 px-4 rounded-xl bg-neutral-900 text-white font-ui text-xs font-semibold hover:bg-neutral-800"
              >
                {t.wizard.viewOwnerStudioBtn}
              </Link>
              <Link
                to="/dashboard/admin"
                className="py-3 px-4 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-bold hover:bg-[#135AF3]"
              >
                {t.wizard.approveAdminBtn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14 bg-neutral-50 min-h-screen">
      <div className="mdp-container max-w-5xl space-y-8">
        {/* Wizard Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                {t.wizard.kicker}
              </p>
              <h1 className="font-display text-2xl sm:text-4xl text-[#0D0D0D] mt-1">
                {t.nav.listProperty}
              </h1>
            </div>
            <div className="font-ui text-xs font-bold text-[#737373] tabular-nums">
              {t.wizard.stepOf} {step} / 9
            </div>
          </div>

          {/* 9-Step Progress Indicator */}
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-9 gap-1.5">
            {stepsList.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`p-2 rounded-lg text-left transition-colors cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#1150EF] text-white border-[#1150EF]'
                      : isDone
                      ? 'bg-[#1150EF]/10 text-[#1150EF] border-[#1150EF]/20'
                      : 'bg-neutral-50 text-[#737373] border-neutral-200/70'
                  }`}
                >
                  <div className="font-ui text-[10px] font-bold tabular-nums">0{s.num}</div>
                  <div className="font-ui text-[11px] font-semibold truncate">{s.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Wizard Step Body */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: PROPERTY CATEGORY */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step1Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step1Desc}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'house', label: t.categories.house, icon: Home },
                  { id: 'villa', label: t.categories.villa, icon: Home },
                  { id: 'apartment', label: t.categories.apartment, icon: Building2 },
                  { id: 'commercial', label: t.categories.commercial, icon: Landmark },
                  { id: 'land', label: t.categories.land, icon: Trees },
                  { id: 'event_space', label: t.categories.event_space, icon: CalendarHeart }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategorySelect(item.id as PropertyCategory)}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                        active
                          ? 'border-[#1150EF] bg-[#1150EF]/6 ring-2 ring-[#1150EF]/20'
                          : 'border-neutral-200 hover:border-[#1150EF]/40'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          active ? 'bg-[#1150EF] text-white' : 'bg-neutral-100 text-[#161616]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-display text-lg text-[#0D0D0D]">{item.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELL OR RENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step2Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step2Desc}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'sale', label: t.wizard.forSaleOpt, unit: 'total' as const },
                  { id: 'rent', label: t.wizard.forRentOpt, unit: 'per_month' as const },
                  { id: 'land', label: t.wizard.landSaleOpt, unit: 'total' as const },
                  { id: 'event', label: t.wizard.eventHireOpt, unit: 'per_day' as const }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setListingType(opt.id as ListingType);
                      setPriceUnit(opt.unit);
                    }}
                    className={`p-5 rounded-2xl border text-left cursor-pointer ${
                      listingType === opt.id
                        ? 'border-[#1150EF] bg-[#1150EF] text-white'
                        : 'border-neutral-200 bg-neutral-50 text-[#161616]'
                    }`}
                  >
                    <div className="font-ui text-sm font-bold">{opt.label}</div>
                  </button>
                ))}
              </div>

              {listingType === 'rent' && (
                <div className="pt-4">
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-2">
                    {t.wizard.prefDurationLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'short_term' as RentalDuration, label: t.search.shortTerm },
                      { id: 'monthly' as RentalDuration, label: t.search.monthly },
                      { id: 'long_term' as RentalDuration, label: t.search.longTerm }
                    ].map((dur) => (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => setRentalDuration(dur.id)}
                        className={`px-4 py-2 rounded-xl font-ui text-xs font-semibold border cursor-pointer ${
                          rentalDuration === dur.id
                            ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                            : 'bg-white text-[#161616] border-neutral-200'
                        }`}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: LOCATION (Task 1, Task 3, Task 4) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-[#0D0D0D]">
                    {t.wizard.step3Title}
                  </h2>
                  <p className="font-body text-sm text-[#737373] mt-1">
                    {t.wizard.step3Desc}
                  </p>
                </div>
                <a
                  href={buildGoogleMapsLocationUrl(draftLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1150EF] font-ui text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Location on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Verified Regional Quick-Presets */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="font-ui text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                  Quick Regional Reference Presets (Auto-fills Country, Province & Coordinates)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {VERIFIED_CITY_REFERENCES.map((ref) => {
                    const isSelected =
                      city.toLowerCase() === ref.city.toLowerCase() &&
                      country.toLowerCase() === ref.country.toLowerCase();
                    return (
                      <button
                        key={`${ref.city}-${ref.country}`}
                        type="button"
                        onClick={() => handleApplyCityPreset(ref.city, ref.country)}
                        className={`px-2.5 py-1.5 rounded-lg font-ui text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1150EF] text-white border-[#1150EF]'
                            : 'bg-white text-[#161616] border-neutral-200 hover:border-[#1150EF]'
                        }`}
                      >
                        {ref.city}, {ref.country === 'Dominican Republic' ? 'DR' : ref.country === 'Haiti' ? 'HT' : 'US'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.countryLabel}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Dominican Republic, Haiti, United States"
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Province / State / Department
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="e.g. La Altagracia, Distrito Nacional, Ouest"
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.cityLabel}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.neighborhoodLabel}
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.addressLabel} (if available)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
              </div>

              {/* Coordinates & Location Display Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    placeholder="e.g. 18.5000"
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    placeholder="e.g. -68.3895"
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Map Location Display Mode
                  </label>
                  <select
                    value={locationAccuracy}
                    onChange={(e) =>
                      setLocationAccuracy(e.target.value as 'approximate' | 'exact')
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                  >
                    <option value="approximate">
                      Approximate Area Reference (Recommended for Privacy)
                    </option>
                    <option value="exact">Exact Verified Property Coordinates</option>
                  </select>
                </div>
              </div>

              {/* Real-time Coordinate Validation Banner */}
              <div
                className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs font-ui ${
                  locationValidation.isValid
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {locationValidation.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <strong>{locationValidation.statusLabel}</strong>
                    {locationValidation.reason && (
                      <span className="block text-[11px] opacity-85 mt-0.5">
                        {locationValidation.reason}
                      </span>
                    )}
                    {city.trim().toLowerCase() === 'cap cana' && (
                      <span className="block text-[11px] opacity-85 mt-0.5">
                        Cap Cana uses approximate geographic reference (18.5000, -68.3895) — not presented as an exact house pin.
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLatInput('');
                    setLngInput('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[#161616] font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  Clear Coordinates
                </button>
              </div>

              {/* Live Map Preview before saving */}
              <div className="space-y-2 pt-2">
                <div className="font-ui text-xs font-bold uppercase tracking-wider text-[#737373]">
                  Live Map Preview
                </div>
                <InteractiveMapDemo
                  properties={[previewPropertyObject]}
                  selectedPropertyId={previewPropertyObject.id}
                  heightClass="h-[280px]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: PROPERTY SPECIFICATIONS (Dynamic for Residential / Land / Event Spaces) */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step4Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step4Desc} ({t.categories[category]})
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.totalAreaLabel}
                  </label>
                  <input
                    type="number"
                    value={areaSqm}
                    onChange={(e) => setAreaSqm(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.lotAreaLabel}
                  </label>
                  <input
                    type="number"
                    value={lotSizeSqm}
                    onChange={(e) => setLotSizeSqm(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.parkingSpacesLabel}
                  </label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui tabular-nums"
                  />
                </div>
              </div>

              {category !== 'land' && category !== 'event_space' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.search.bedrooms}
                    </label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.property.bathroomsLabel}
                    </label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 h-11 px-4 rounded-xl bg-neutral-50 border border-neutral-200 w-full cursor-pointer font-ui text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={furnished}
                        onChange={(e) => setFurnished(e.target.checked)}
                        className="accent-[#1150EF]"
                      />
                      <span>{t.wizard.turnkeyFurnished}</span>
                    </label>
                  </div>
                </div>
              )}

              {category === 'land' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.wizard.zoningClassLabel}
                    </label>
                    <input
                      type="text"
                      value={zoningType}
                      onChange={(e) => setZoningType(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.wizard.topographyElevLabel}
                    </label>
                    <input
                      type="text"
                      value={topography}
                      onChange={(e) => setTopography(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                  <label className="flex items-center gap-2 font-ui text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={roadAccess}
                      onChange={(e) => setRoadAccess(e.target.checked)}
                      className="accent-[#1150EF]"
                    />
                    <span>{t.wizard.directRoadAccess}</span>
                  </label>
                </div>
              )}

              {category === 'event_space' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.wizard.maxGuestCapLabel}
                    </label>
                    <input
                      type="number"
                      value={guestCapacity}
                      onChange={(e) => setGuestCapacity(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.wizard.spaceConfigLabel}
                    </label>
                    <select
                      value={indoorOutdoor}
                      onChange={(e) =>
                        setIndoorOutdoor(e.target.value as 'indoor' | 'outdoor' | 'both')
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                    >
                      <option value="both">{t.wizard.indoorOutdoorBoth}</option>
                      <option value="indoor">{t.wizard.indoorOnly}</option>
                      <option value="outdoor">{t.wizard.outdoorOnly}</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.wizard.eventRulesLabel}
                    </label>
                    <input
                      type="text"
                      value={eventRestrictions}
                      onChange={(e) => setEventRestrictions(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: IMAGES */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step5Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step5Desc}
                </p>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-ui flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <label className="h-11 px-4 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingImage ? 'Uploading...' : t.wizard.uploadFileBtn}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder={t.wizard.pasteUrlPlaceholder}
                    className="flex-1 h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        setImages((prev) => [customImageUrl.trim(), ...prev]);
                        setCustomImageUrl('');
                      }
                    }}
                    className="h-11 px-4 rounded-xl bg-neutral-900 text-white font-ui text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span>{t.wizard.addUrlBtn}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 group"
                  >
                    <PropertyImage
                      src={img}
                      alt={`Property upload ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/75 text-white text-[10px] font-ui cursor-pointer"
                    >
                      {t.wizard.removeBtn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: PRICING */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step6Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step6Desc}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.priceUsdLabel}
                  </label>
                  <input
                    type="number"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl border border-neutral-200 text-lg font-ui font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.wizard.pricingBasisLabel}
                  </label>
                  <select
                    value={priceUnit}
                    onChange={(e) =>
                      setPriceUnit(e.target.value as Property['priceUnit'])
                    }
                    className="w-full h-12 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                  >
                    <option value="total">{t.wizard.basisTotal}</option>
                    <option value="per_month">{t.wizard.basisMonth}</option>
                    <option value="per_night">{t.wizard.basisNight}</option>
                    <option value="per_day">{t.wizard.basisDay}</option>
                  </select>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-ui text-[#161616]">
                {t.wizard.formattedPreviewLabel}:{' '}
                <strong className="text-[#1150EF] text-sm tabular-nums">
                  {formatPrice(priceUSD, priceUnit)}
                </strong>
              </div>
            </div>
          )}

          {/* STEP 7: DESCRIPTION */}
          {step === 7 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step7Title}
                </h2>
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.propTitleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.propSubtitleLabel}
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.fullDescLabel}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.keyAmenitiesLabel}
                </label>
                <input
                  type="text"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
            </div>
          )}

          {/* STEP 8: OWNER CONTACT DETAILS */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step8Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step8Desc}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.fullName}
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.email}
                  </label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.phoneRequired}
                  </label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: PREVIEW AND SUBMIT */}
          {step === 9 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.wizard.step9Title}
                </h2>
                <p className="font-body text-sm text-[#737373] mt-1">
                  {t.wizard.step9Desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-neutral-200">
                  <PropertyImage
                    src={images[0] || SCENEAI_IMAGES.latest1}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-7 space-y-2">
                  <div className="text-xs font-ui font-bold uppercase text-[#1150EF]">
                    {t.categories[category]} · {listingType.toUpperCase()}
                  </div>
                  <h3 className="font-display text-2xl text-[#0D0D0D]">{title}</h3>
                  <p className="text-xs font-body text-[#737373]">
                    {address ? `${address} — ` : ''}
                    {neighborhood}, {city}
                    {province ? `, ${province}` : ''}, {country}
                  </p>
                  <p className="text-[11px] font-ui font-semibold text-[#1150EF]">
                    {locationValidation.statusLabel}
                    {parsedCoordinates
                      ? ` (${parsedCoordinates.lat.toFixed(4)}, ${parsedCoordinates.lng.toFixed(4)})`
                      : ''}
                  </p>
                  <div className="font-ui text-xl font-bold text-[#0D0D0D] tabular-nums pt-1">
                    {formatPrice(priceUSD, priceUnit)}
                  </div>
                  <p className="text-xs font-body text-[#161616]/85 line-clamp-3 pt-1">
                    {description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-ui text-emerald-800">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {t.wizard.submittedByLabel} {ownerName} ({ownerEmail})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 font-ui text-xs font-semibold text-[#161616] disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.wizard.prevStepBtn}</span>
            </button>

            {step < 9 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(9, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {t.wizard.continueStepBtn} {step + 1}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.wizard.submitFinalBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
