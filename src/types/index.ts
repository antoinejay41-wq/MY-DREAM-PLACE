export type LanguageCode = 'en' | 'fr' | 'es' | 'ht';
export type CurrencyCode = 'USD' | 'DOP' | 'HTG';
export type UserRole = 'customer' | 'owner' | 'agent' | 'admin';

export type PropertyCategory = 'house' | 'apartment' | 'villa' | 'commercial' | 'land' | 'event_space';
export type ListingType = 'sale' | 'rent' | 'land' | 'event';
export type RentalDuration = 'short_term' | 'long_term' | 'monthly' | 'daily';
export type EventType = 'wedding' | 'birthday' | 'conference' | 'corporate' | 'private';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected' | 'changes_requested';
export type PropertyAvailabilityStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'hidden';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  preferredLanguage: LanguageCode;
  preferredCurrency: CurrencyCode;
  verified: boolean;
  joinedDate: string;
  bio?: string;
}

export interface Owner {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  phone: string;
  whatsapp?: string;
  verified: boolean;
  responseRate: number;
  responseTime: string;
  joinedYear: number;
  totalListings: number;
  languages: string[];
  bio: string;
}

export interface Agent extends Owner {
  agencyName: string;
  licenseNumber: string;
  specialties: string[];
  regionsServed: string[];
  soldCount: number;
  rating: number;
  reviewCount: number;
}

export interface Property {
  id: string;
  referenceCode: string;
  title: string;
  subtitle?: string;
  category: PropertyCategory;
  listingType: ListingType;
  priceUSD: number;
  priceUnit?: 'total' | 'per_month' | 'per_night' | 'per_day' | 'per_sqm';
  rentalDuration?: RentalDuration;
  location: {
    country: string;
    province?: string;
    city: string;
    neighborhood: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    } | null;
    locationAccuracy?: 'approximate' | 'exact';
  };
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    areaSqm: number;
    lotSizeSqm?: number;
    yearBuilt?: number;
    parkingSpaces?: number;
    furnished?: boolean;
    zoningType?: string;
    topography?: string;
    roadAccess?: boolean;
    utilitiesAvailable?: string[];
    guestCapacity?: number;
    indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
    eventTypesSupported?: EventType[];
    eventRestrictions?: string[];
    cateringAllowed?: boolean;
  };
  description: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  videoUrl?: string;
  hasVirtualTour?: boolean;
  virtualTourLabel?: string;
  ownerId: string;
  agentId?: string;
  featured?: boolean;
  featuredOrder?: number;
  latestEditorial?: boolean;
  approvalStatus: ApprovalStatus;
  availabilityStatus?: PropertyAvailabilityStatus;
  adminNotes?: string;
  dateListed: string;
  viewsCount: number;
  inquiriesCount: number;
  availableFrom?: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyReference: string;
  propertyTitle: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ownerId: string;
  subject: string;
  initialMessage: string;
  status: 'new' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  inquiryId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyReference: string;
  propertyTitle: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ownerId: string;
  preferredDate: string;
  preferredTime: string;
  visitType: 'in_person' | 'video_call' | 'event_inspection';
  guestCount?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'declined';
  ownerResponseNote?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientRole: UserRole | 'all';
  title: string;
  message: string;
  type: 'inquiry' | 'approval' | 'viewing' | 'system';
  relatedPropertyId?: string;
  read: boolean;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  tab: ListingType;
  location: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  guestCapacity?: number;
  rentalDuration?: string;
  createdAt: string;
}

export interface ListingApproval {
  id: string;
  propertyId: string;
  propertyTitle: string;
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface WebsiteContent {
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroHeadlineLine3: string;
  heroTaglineLine1: string;
  heroTaglineLine2: string;
  heroBgImage: string;
  heroVideoUrl: string;
  heroVideoPoster: string;
  heroVideoCaption: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  latestPlacesTitleLine1: string;
  latestPlacesTitleLine2: string;
  latestPlacesTitleLine3: string;
  latestPlacesSubtitle: string;
  categoriesSectionKicker: string;
  categoriesSectionTitle: string;
  homepageCategoryOrder: PropertyCategory[];
  featuredHousesKicker: string;
  featuredHousesTitle: string;
  featuredApartmentsKicker: string;
  featuredApartmentsTitle: string;
  landEventsKicker: string;
  landEventsTitle: string;
  popularLocationsKicker: string;
  popularLocationsTitle: string;
  aboutSectionKicker: string;
  aboutSectionTitle: string;
  aboutSectionDescription: string;
  aboutSectionHighlights: string[];
  howItWorksKicker: string;
  howItWorksTitle: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Title: string;
  howStep3Desc: string;
  trustSafetyTitle: string;
  trustTip1: string;
  trustTip2: string;
  trustTip3: string;
  ownerCtaKicker: string;
  ownerCtaTitle: string;
  ownerCtaDesc: string;
  announcementBanner: string;
  showAnnouncementBanner: boolean;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  footerDescription: string;
  footerCopyrightText: string;
}

export interface BrandingSettings {
  siteName: string;
  subtitle: string;
  slogan: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  skyBlueColor: string;
  lightBlueColor: string;
  buttonRadius: 'rounded-xl' | 'rounded-full' | 'rounded-none';
  typographyPreset: 'classic_luxury' | 'modern_editorial' | 'architectural_sans';
  showGridLines: boolean;
  sectionVisibility: {
    heroVideoCard: boolean;
    latestPlaces: boolean;
    categoriesStrip: boolean;
    featuredHouses: boolean;
    featuredApartments: boolean;
    landAndEvents: boolean;
    popularLocations: boolean;
    aboutSection: boolean;
    howItWorksAndTrust: boolean;
    ownerCtaBanner: boolean;
  };
  footerBrandNote: string;
}

export interface NavMenuItem {
  id: string;
  to: string;
  labelKey: string;
  customLabel?: string;
  visible: boolean;
  essential?: boolean;
  group: 'primary' | 'secondary';
}

export interface FooterLinkItem {
  id: string;
  label: string;
  to: string;
  visible: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
}

export interface NavigationConfig {
  headerItems: NavMenuItem[];
  footerLinks: FooterLinkItem[];
  socialLinks: SocialLinkItem[];
}

export interface WebsiteSettings {
  defaultLanguage: LanguageCode;
  defaultCurrency: CurrencyCode;
  exchangeRates: Record<CurrencyCode, number>;
  enableAssistantWidget: boolean;
  enablePropertyComparison: boolean;
  requireAdminApprovalForNewListings: boolean;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
}

export type CustomTranslations = Record<LanguageCode, Record<string, string>>;

export interface CmsSnapshot {
  websiteContent: WebsiteContent;
  branding: BrandingSettings;
  navigationConfig: NavigationConfig;
  websiteSettings: WebsiteSettings;
  customTranslations: CustomTranslations;
  savedAt: string;
}

export interface SearchFilters {
  tab: ListingType;
  location: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  rentalDuration: string;
  eventDate: string;
  guestCapacity: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'area_desc';
}
