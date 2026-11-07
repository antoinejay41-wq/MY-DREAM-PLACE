import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Agent,
  ApprovalStatus,
  BrandingSettings,
  CmsSnapshot,
  CurrencyCode,
  CustomTranslations,
  Inquiry,
  LanguageCode,
  ListingApproval,
  Message,
  NavigationConfig,
  Notification,
  Owner,
  Property,
  SavedSearch,
  SearchFilters,
  User,
  UserRole,
  ViewingRequest,
  WebsiteContent,
  WebsiteSettings
} from '../types';
import { TranslationDictionary, translations } from '../translations';
import {
  INITIAL_AGENTS,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_BRANDING,
  INITIAL_CUSTOM_TRANSLATIONS,
  INITIAL_CUSTOMERS,
  INITIAL_INQUIRIES,
  INITIAL_MESSAGES,
  INITIAL_NAVIGATION_CONFIG,
  INITIAL_NOTIFICATIONS,
  INITIAL_OWNERS,
  INITIAL_PROPERTIES,
  INITIAL_SAVED_SEARCHES,
  INITIAL_USER,
  INITIAL_VIEWING_REQUESTS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_WEBSITE_SETTINGS
} from '../data/mockData';
import {
  clearAllMediaAssetsFromDB,
  DEFAULT_MEDIA_ASSETS,
  deleteMediaAssetFromDB,
  getAllMediaAssets,
  MediaAsset,
  saveMediaAsset,
  validateAndReadMediaFile
} from '../utils/mediaStorage';

const STORAGE_PREFIX = 'mdp_demo_v2_';

const DEFAULT_FILTERS: SearchFilters = {
  tab: 'sale',
  location: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  rentalDuration: 'all',
  eventDate: '',
  guestCapacity: '',
  sortBy: 'featured'
};

interface MarketplaceContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (priceUSD: number, unit?: Property['priceUnit']) => string;
  currentUser: User;
  updateCurrentUser: (patch: Partial<User>) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  properties: Property[];
  publicProperties: Property[];
  owners: Owner[];
  agents: Agent[];
  customers: User[];
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  compareIds: string[];
  toggleCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  savedSearches: SavedSearch[];
  saveCurrentSearch: (name?: string) => void;
  deleteSavedSearch: (id: string) => void;
  inquiries: Inquiry[];
  messages: Message[];
  viewingRequests: ViewingRequest[];
  notifications: Notification[];
  approvalQueue: ListingApproval[];

  // Active (Published or Draft Preview) CMS Configuration
  websiteContent: WebsiteContent;
  branding: BrandingSettings;
  navigationConfig: NavigationConfig;
  websiteSettings: WebsiteSettings;
  customTranslations: CustomTranslations;

  // Draft CMS State & Publishing Controls
  draftWebsiteContent: WebsiteContent;
  draftBranding: BrandingSettings;
  draftNavigationConfig: NavigationConfig;
  draftWebsiteSettings: WebsiteSettings;
  draftCustomTranslations: CustomTranslations;
  isDraftPreviewMode: boolean;
  setIsDraftPreviewMode: (enabled: boolean) => void;
  hasUnsavedDraftChanges: boolean;
  previousPublishedSnapshot: CmsSnapshot | null;
  lastPublishedAt: string;
  updateDraftWebsiteContent: (patch: Partial<WebsiteContent>) => void;
  updateDraftBranding: (patch: Partial<BrandingSettings>) => void;
  updateDraftNavigationConfig: (patch: Partial<NavigationConfig>) => void;
  updateDraftWebsiteSettings: (patch: Partial<WebsiteSettings>) => void;
  updateDraftTranslation: (lang: LanguageCode, dotPath: string, value: string) => void;
  saveDraftChanges: () => void;
  publishDraftChanges: () => void;
  discardDraftChanges: () => void;
  restorePreviousVersion: () => void;

  // Legacy immediate updaters (update both Draft & Published)
  updateWebsiteContent: (patch: Partial<WebsiteContent>) => void;
  updateBranding: (patch: Partial<BrandingSettings>) => void;

  // IndexedDB Media Library
  mediaAssets: MediaAsset[];
  uploadMediaFromDevice: (
    file: File,
    category?: MediaAsset['category'],
    usedIn?: string
  ) => Promise<MediaAsset>;
  replaceMediaAssetFile: (assetId: string, file: File) => Promise<MediaAsset>;
  removeMediaAsset: (assetId: string) => Promise<void>;
  registerExternalMediaUrl: (
    name: string,
    url: string,
    category?: MediaAsset['category'],
    type?: MediaAsset['type']
  ) => Promise<MediaAsset>;

  // Property, Owner, Agent, Customer CRUD
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetSearchFilters: () => void;
  createInquiry: (payload: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message: string;
  }) => Inquiry;
  sendMessage: (inquiryId: string, content: string, senderRole?: UserRole) => void;
  updateInquiryStatus: (inquiryId: string, status: Inquiry['status']) => void;
  deleteInquiry: (inquiryId: string) => void;
  createViewingRequest: (payload: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    preferredDate: string;
    preferredTime: string;
    visitType: ViewingRequest['visitType'];
    guestCount?: number;
    notes?: string;
  }) => ViewingRequest;
  updateViewingStatus: (
    requestId: string,
    status: ViewingRequest['status'],
    ownerResponseNote?: string
  ) => void;
  submitNewProperty: (
    newProp: Omit<
      Property,
      'id' | 'referenceCode' | 'approvalStatus' | 'dateListed' | 'viewsCount' | 'inquiriesCount'
    >,
    autoApprove?: boolean
  ) => Property;
  updateProperty: (propertyId: string, patch: Partial<Property>) => void;
  deleteProperty: (propertyId: string) => void;
  reorderFeaturedProperties: (orderedPropertyIds: string[]) => void;
  reviewPropertyApproval: (
    propertyId: string,
    status: ApprovalStatus,
    reviewerNotes?: string
  ) => void;
  updateOwner: (ownerId: string, patch: Partial<Owner>) => void;
  addOwner: (owner: Omit<Owner, 'id'>) => Owner;
  deleteOwner: (ownerId: string) => void;
  updateAgent: (agentId: string, patch: Partial<Agent>) => void;
  updateCustomer: (customerId: string, patch: Partial<User>) => void;
  addCustomer: (customer: Omit<User, 'id' | 'joinedDate'>) => User;
  deleteCustomer: (customerId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  reportProperty: (propertyId: string, reason: string) => void;
  resetDemoData: () => void;
  authModalMode: 'signin' | 'register' | null;
  setAuthModalMode: (mode: 'signin' | 'register' | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed } as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in demo mode
  }
}

function applyTranslationOverrides(
  base: TranslationDictionary,
  overrides: Record<string, string>
): TranslationDictionary {
  if (!overrides || Object.keys(overrides).length === 0) return base;
  const cloned = JSON.parse(JSON.stringify(base)) as Record<string, Record<string, string>>;
  for (const [dotKey, val] of Object.entries(overrides)) {
    if (!val || !val.trim()) continue;
    const [section, field] = dotKey.split('.');
    if (section && field && cloned[section] && typeof cloned[section] === 'object') {
      cloned[section][field] = val;
    }
  }
  return cloned as unknown as TranslationDictionary;
}

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() =>
    loadFromStorage<LanguageCode>('language', 'en')
  );
  const [currency, setCurrencyState] = useState<CurrencyCode>(() =>
    loadFromStorage<CurrencyCode>('currency', 'USD')
  );
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage<User>('user', INITIAL_USER)
  );
  const [activeRole, setActiveRoleState] = useState<UserRole>(() =>
    loadFromStorage<UserRole>('activeRole', 'customer')
  );
  const [properties, setProperties] = useState<Property[]>(() =>
    loadFromStorage<Property[]>('properties', INITIAL_PROPERTIES)
  );
  const [owners, setOwners] = useState<Owner[]>(() =>
    loadFromStorage<Owner[]>('owners', INITIAL_OWNERS)
  );
  const [agents, setAgents] = useState<Agent[]>(() =>
    loadFromStorage<Agent[]>('agents', INITIAL_AGENTS)
  );
  const [customers, setCustomers] = useState<User[]>(() =>
    loadFromStorage<User[]>('customers', INITIAL_CUSTOMERS)
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadFromStorage<string[]>('favorites', ['prop-101', 'prop-103'])
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    loadFromStorage<string[]>('compareIds', [])
  );
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() =>
    loadFromStorage<SavedSearch[]>('savedSearches', INITIAL_SAVED_SEARCHES)
  );
  const [inquiries, setInquiries] = useState<Inquiry[]>(() =>
    loadFromStorage<Inquiry[]>('inquiries', INITIAL_INQUIRIES)
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    loadFromStorage<Message[]>('messages', INITIAL_MESSAGES)
  );
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>(() =>
    loadFromStorage<ViewingRequest[]>('viewingRequests', INITIAL_VIEWING_REQUESTS)
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage<Notification[]>('notifications', INITIAL_NOTIFICATIONS)
  );
  const [approvalQueue, setApprovalQueue] = useState<ListingApproval[]>(() =>
    loadFromStorage<ListingApproval[]>('approvalQueue', INITIAL_APPROVAL_QUEUE)
  );

  // Published CMS States
  const [publishedWebsiteContent, setPublishedWebsiteContent] = useState<WebsiteContent>(() =>
    loadFromStorage<WebsiteContent>('websiteContent', INITIAL_WEBSITE_CONTENT)
  );
  const [publishedBranding, setPublishedBranding] = useState<BrandingSettings>(() =>
    loadFromStorage<BrandingSettings>('branding', INITIAL_BRANDING)
  );
  const [publishedNavigationConfig, setPublishedNavigationConfig] = useState<NavigationConfig>(() =>
    loadFromStorage<NavigationConfig>('navigationConfig', INITIAL_NAVIGATION_CONFIG)
  );
  const [publishedWebsiteSettings, setPublishedWebsiteSettings] = useState<WebsiteSettings>(() =>
    loadFromStorage<WebsiteSettings>('websiteSettings', INITIAL_WEBSITE_SETTINGS)
  );
  const [publishedCustomTranslations, setPublishedCustomTranslations] =
    useState<CustomTranslations>(() =>
      loadFromStorage<CustomTranslations>('customTranslations', INITIAL_CUSTOM_TRANSLATIONS)
    );

  // Draft CMS States
  const [draftWebsiteContent, setDraftWebsiteContent] = useState<WebsiteContent>(() =>
    loadFromStorage<WebsiteContent>('draftWebsiteContent', publishedWebsiteContent)
  );
  const [draftBranding, setDraftBranding] = useState<BrandingSettings>(() =>
    loadFromStorage<BrandingSettings>('draftBranding', publishedBranding)
  );
  const [draftNavigationConfig, setDraftNavigationConfig] = useState<NavigationConfig>(() =>
    loadFromStorage<NavigationConfig>('draftNavigationConfig', publishedNavigationConfig)
  );
  const [draftWebsiteSettings, setDraftWebsiteSettings] = useState<WebsiteSettings>(() =>
    loadFromStorage<WebsiteSettings>('draftWebsiteSettings', publishedWebsiteSettings)
  );
  const [draftCustomTranslations, setDraftCustomTranslations] = useState<CustomTranslations>(() =>
    loadFromStorage<CustomTranslations>('draftCustomTranslations', publishedCustomTranslations)
  );

  const [previousPublishedSnapshot, setPreviousPublishedSnapshot] = useState<CmsSnapshot | null>(
    () => loadFromStorage<CmsSnapshot | null>('previousPublishedSnapshot', null)
  );
  const [lastPublishedAt, setLastPublishedAt] = useState<string>(() =>
    loadFromStorage<string>('lastPublishedAt', new Date().toISOString())
  );
  const [isDraftPreviewMode, setIsDraftPreviewMode] = useState<boolean>(false);

  // Media Library Assets (IndexedDB)
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(DEFAULT_MEDIA_ASSETS);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Load Media Library from IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    getAllMediaAssets()
      .then((assets) => {
        if (mounted) setMediaAssets(assets);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    saveToStorage('language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => saveToStorage('currency', currency), [currency]);
  useEffect(() => saveToStorage('user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('activeRole', activeRole), [activeRole]);
  useEffect(() => saveToStorage('properties', properties), [properties]);
  useEffect(() => saveToStorage('owners', owners), [owners]);
  useEffect(() => saveToStorage('agents', agents), [agents]);
  useEffect(() => saveToStorage('customers', customers), [customers]);
  useEffect(() => saveToStorage('favorites', favorites), [favorites]);
  useEffect(() => saveToStorage('compareIds', compareIds), [compareIds]);
  useEffect(() => saveToStorage('savedSearches', savedSearches), [savedSearches]);
  useEffect(() => saveToStorage('inquiries', inquiries), [inquiries]);
  useEffect(() => saveToStorage('messages', messages), [messages]);
  useEffect(() => saveToStorage('viewingRequests', viewingRequests), [viewingRequests]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('approvalQueue', approvalQueue), [approvalQueue]);

  useEffect(() => saveToStorage('websiteContent', publishedWebsiteContent), [publishedWebsiteContent]);
  useEffect(() => saveToStorage('branding', publishedBranding), [publishedBranding]);
  useEffect(() => saveToStorage('navigationConfig', publishedNavigationConfig), [publishedNavigationConfig]);
  useEffect(() => saveToStorage('websiteSettings', publishedWebsiteSettings), [publishedWebsiteSettings]);
  useEffect(() => saveToStorage('customTranslations', publishedCustomTranslations), [publishedCustomTranslations]);

  useEffect(() => saveToStorage('draftWebsiteContent', draftWebsiteContent), [draftWebsiteContent]);
  useEffect(() => saveToStorage('draftBranding', draftBranding), [draftBranding]);
  useEffect(() => saveToStorage('draftNavigationConfig', draftNavigationConfig), [draftNavigationConfig]);
  useEffect(() => saveToStorage('draftWebsiteSettings', draftWebsiteSettings), [draftWebsiteSettings]);
  useEffect(() => saveToStorage('draftCustomTranslations', draftCustomTranslations), [draftCustomTranslations]);
  useEffect(() => saveToStorage('previousPublishedSnapshot', previousPublishedSnapshot), [previousPublishedSnapshot]);
  useEffect(() => saveToStorage('lastPublishedAt', lastPublishedAt), [lastPublishedAt]);

  // Active CMS configuration (Draft when in preview mode, Published otherwise)
  const websiteContent = isDraftPreviewMode ? draftWebsiteContent : publishedWebsiteContent;
  const branding = isDraftPreviewMode ? draftBranding : publishedBranding;
  const navigationConfig = isDraftPreviewMode ? draftNavigationConfig : publishedNavigationConfig;
  const websiteSettings = isDraftPreviewMode ? draftWebsiteSettings : publishedWebsiteSettings;
  const customTranslations = isDraftPreviewMode
    ? draftCustomTranslations
    : publishedCustomTranslations;

  const hasUnsavedDraftChanges = useMemo(() => {
    return (
      JSON.stringify(draftWebsiteContent) !== JSON.stringify(publishedWebsiteContent) ||
      JSON.stringify(draftBranding) !== JSON.stringify(publishedBranding) ||
      JSON.stringify(draftNavigationConfig) !== JSON.stringify(publishedNavigationConfig) ||
      JSON.stringify(draftWebsiteSettings) !== JSON.stringify(publishedWebsiteSettings) ||
      JSON.stringify(draftCustomTranslations) !== JSON.stringify(publishedCustomTranslations)
    );
  }, [
    draftWebsiteContent,
    publishedWebsiteContent,
    draftBranding,
    publishedBranding,
    draftNavigationConfig,
    publishedNavigationConfig,
    draftWebsiteSettings,
    publishedWebsiteSettings,
    draftCustomTranslations,
    publishedCustomTranslations
  ]);

  // Apply Centralized Theme & Typography CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', branding.primaryColor || '#1150EF');
    root.style.setProperty('--color-secondary', branding.secondaryColor || '#135AF3');
    root.style.setProperty('--color-sky', branding.skyBlueColor || '#76A2FA');
    root.style.setProperty('--color-light-blue', branding.lightBlueColor || '#B9CFFD');

    if (branding.typographyPreset === 'modern_editorial') {
      root.style.setProperty('--font-display', "'Georgia', 'Playfair Display', serif");
      root.style.setProperty('--font-sans', "'Manrope', -apple-system, sans-serif");
      root.style.setProperty('--font-ui', "'Manrope', -apple-system, sans-serif");
    } else if (branding.typographyPreset === 'architectural_sans') {
      root.style.setProperty('--font-display', "'Archivo', -apple-system, sans-serif");
      root.style.setProperty('--font-sans', "'Archivo', -apple-system, sans-serif");
      root.style.setProperty('--font-ui', "'Manrope', -apple-system, sans-serif");
    } else {
      root.style.setProperty('--font-display', "'Playfair Display', Georgia, serif");
      root.style.setProperty('--font-sans', "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif");
      root.style.setProperty('--font-ui', "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif");
    }
  }, [branding]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setCurrentUser((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    setCurrentUser((prev) => ({ ...prev, preferredCurrency: curr }));
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const t = useMemo(() => {
    const base = translations[language] || translations.en;
    const langOverrides = customTranslations[language] || {};
    return applyTranslationOverrides(base, langOverrides);
  }, [language, customTranslations]);

  const formatPrice = (priceUSD: number, unit?: Property['priceUnit']): string => {
    const rates: Record<CurrencyCode, number> = websiteSettings.exchangeRates || {
      USD: 1,
      DOP: 60.5,
      HTG: 132.0
    };
    const converted = Math.round(priceUSD * (rates[currency] || 1));
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(converted);

    const prefix = currency === 'USD' ? '$' : currency === 'DOP' ? 'RD$ ' : 'HTG ';

    let unitSuffix = '';
    if (unit === 'per_month') {
      unitSuffix =
        language === 'fr'
          ? ' / mois'
          : language === 'es'
            ? ' / mes'
            : language === 'ht'
              ? ' / mwa'
              : ' / mo';
    } else if (unit === 'per_night') {
      unitSuffix =
        language === 'fr'
          ? ' / nuit'
          : language === 'es'
            ? ' / noche'
            : language === 'ht'
              ? ' / nwit'
              : ' / night';
    } else if (unit === 'per_day') {
      unitSuffix =
        language === 'fr'
          ? ' / jour'
          : language === 'es'
            ? ' / día'
            : language === 'ht'
              ? ' / jou'
              : ' / event day';
    }

    return `${prefix}${formattedNumber}${unitSuffix}`;
  };

  const publicProperties = useMemo(
    () =>
      properties.filter(
        (p) => p.approvalStatus === 'approved' && p.availabilityStatus !== 'hidden'
      ),
    [properties]
  );

  // Draft & Publish CMS Actions
  const updateDraftWebsiteContent = (patch: Partial<WebsiteContent>) => {
    setDraftWebsiteContent((prev) => ({ ...prev, ...patch }));
  };

  const updateDraftBranding = (patch: Partial<BrandingSettings>) => {
    setDraftBranding((prev) => ({ ...prev, ...patch }));
  };

  const updateDraftNavigationConfig = (patch: Partial<NavigationConfig>) => {
    setDraftNavigationConfig((prev) => ({ ...prev, ...patch }));
  };

  const updateDraftWebsiteSettings = (patch: Partial<WebsiteSettings>) => {
    setDraftWebsiteSettings((prev) => ({ ...prev, ...patch }));
  };

  const updateDraftTranslation = (lang: LanguageCode, dotPath: string, value: string) => {
    setDraftCustomTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...(prev[lang] || {}),
        [dotPath]: value
      }
    }));
  };

  const saveDraftChanges = () => {
    saveToStorage('draftWebsiteContent', draftWebsiteContent);
    saveToStorage('draftBranding', draftBranding);
    saveToStorage('draftNavigationConfig', draftNavigationConfig);
    saveToStorage('draftWebsiteSettings', draftWebsiteSettings);
    saveToStorage('draftCustomTranslations', draftCustomTranslations);
    showToast('Draft saved locally. Use Preview or Publish when ready.');
  };

  const publishDraftChanges = () => {
    const snapshot: CmsSnapshot = {
      websiteContent: publishedWebsiteContent,
      branding: publishedBranding,
      navigationConfig: publishedNavigationConfig,
      websiteSettings: publishedWebsiteSettings,
      customTranslations: publishedCustomTranslations,
      savedAt: lastPublishedAt
    };
    setPreviousPublishedSnapshot(snapshot);
    setPublishedWebsiteContent(draftWebsiteContent);
    setPublishedBranding(draftBranding);
    setPublishedNavigationConfig(draftNavigationConfig);
    setPublishedWebsiteSettings(draftWebsiteSettings);
    setPublishedCustomTranslations(draftCustomTranslations);
    const now = new Date().toISOString();
    setLastPublishedAt(now);
    setIsDraftPreviewMode(false);
    showToast('Changes published! Live public pages have been updated immediately.');
  };

  const discardDraftChanges = () => {
    setDraftWebsiteContent(publishedWebsiteContent);
    setDraftBranding(publishedBranding);
    setDraftNavigationConfig(publishedNavigationConfig);
    setDraftWebsiteSettings(publishedWebsiteSettings);
    setDraftCustomTranslations(publishedCustomTranslations);
    setIsDraftPreviewMode(false);
    showToast('Draft changes discarded and synced with Published state.');
  };

  const restorePreviousVersion = () => {
    if (previousPublishedSnapshot) {
      setPublishedWebsiteContent(previousPublishedSnapshot.websiteContent);
      setPublishedBranding(previousPublishedSnapshot.branding);
      setPublishedNavigationConfig(previousPublishedSnapshot.navigationConfig);
      setPublishedWebsiteSettings(previousPublishedSnapshot.websiteSettings);
      setPublishedCustomTranslations(previousPublishedSnapshot.customTranslations);

      setDraftWebsiteContent(previousPublishedSnapshot.websiteContent);
      setDraftBranding(previousPublishedSnapshot.branding);
      setDraftNavigationConfig(previousPublishedSnapshot.navigationConfig);
      setDraftWebsiteSettings(previousPublishedSnapshot.websiteSettings);
      setDraftCustomTranslations(previousPublishedSnapshot.customTranslations);
      setLastPublishedAt(new Date().toISOString());
      setPreviousPublishedSnapshot(null);
      showToast('Restored previous published website version.');
    } else {
      setPublishedWebsiteContent(INITIAL_WEBSITE_CONTENT);
      setPublishedBranding(INITIAL_BRANDING);
      setPublishedNavigationConfig(INITIAL_NAVIGATION_CONFIG);
      setPublishedWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
      setPublishedCustomTranslations(INITIAL_CUSTOM_TRANSLATIONS);

      setDraftWebsiteContent(INITIAL_WEBSITE_CONTENT);
      setDraftBranding(INITIAL_BRANDING);
      setDraftNavigationConfig(INITIAL_NAVIGATION_CONFIG);
      setDraftWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
      setDraftCustomTranslations(INITIAL_CUSTOM_TRANSLATIONS);
      showToast('Restored default demo website version.');
    }
  };

  const updateWebsiteContent = (patch: Partial<WebsiteContent>) => {
    setDraftWebsiteContent((prev) => ({ ...prev, ...patch }));
    setPublishedWebsiteContent((prev) => ({ ...prev, ...patch }));
    showToast('Website content updated');
  };

  const updateBranding = (patch: Partial<BrandingSettings>) => {
    setDraftBranding((prev) => ({ ...prev, ...patch }));
    setPublishedBranding((prev) => ({ ...prev, ...patch }));
    showToast('Branding settings updated');
  };

  // IndexedDB Media Library Handlers
  const uploadMediaFromDevice = async (
    file: File,
    category: MediaAsset['category'] = 'general',
    usedIn?: string
  ): Promise<MediaAsset> => {
    const currentTotalBytes = mediaAssets.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
    const { asset } = await validateAndReadMediaFile(file, currentTotalBytes);
    const enriched: MediaAsset = {
      ...asset,
      category,
      usedIn: usedIn || 'Uploaded from Device'
    };
    await saveMediaAsset(enriched);
    setMediaAssets((prev) => [enriched, ...prev]);
    showToast(`Uploaded "${enriched.name}" to IndexedDB Media Library`);
    return enriched;
  };

  const replaceMediaAssetFile = async (assetId: string, file: File): Promise<MediaAsset> => {
    const existing = mediaAssets.find((m) => m.id === assetId);
    const currentTotalBytes = mediaAssets
      .filter((m) => m.id !== assetId)
      .reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
    const { asset } = await validateAndReadMediaFile(file, currentTotalBytes);
    const updated: MediaAsset = {
      ...asset,
      id: assetId,
      name: existing?.name || asset.name,
      category: existing?.category || asset.category,
      usedIn: existing?.usedIn || 'Replaced Media Asset'
    };
    await saveMediaAsset(updated);
    setMediaAssets((prev) => prev.map((m) => (m.id === assetId ? updated : m)));
    showToast(`Replaced media file for "${updated.name}"`);
    return updated;
  };

  const removeMediaAsset = async (assetId: string): Promise<void> => {
    await deleteMediaAssetFromDB(assetId);
    setMediaAssets((prev) => prev.filter((m) => m.id !== assetId));
    showToast('Media file removed from library');
  };

  const registerExternalMediaUrl = async (
    name: string,
    url: string,
    category: MediaAsset['category'] = 'general',
    type: MediaAsset['type'] = 'image'
  ): Promise<MediaAsset> => {
    const asset: MediaAsset = {
      id: `media-${Date.now()}`,
      name: name.trim() || 'External Media Asset',
      type,
      category,
      url: url.trim(),
      sizeBytes: 120000,
      mimeType: type === 'video' ? 'video/mp4' : 'image/jpeg',
      createdAt: new Date().toISOString(),
      usedIn: 'External URL Asset'
    };
    await saveMediaAsset(asset);
    setMediaAssets((prev) => [asset, ...prev]);
    showToast(`Added "${asset.name}" to Media Library`);
    return asset;
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propertyId);
      const next = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      showToast(exists ? 'Removed from saved properties' : 'Saved to your favorites');
      return next;
    });
  };

  const toggleCompare = (propertyId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 properties at a time.');
        return prev;
      }
      showToast('Added to property comparison bar');
      return [...prev, propertyId];
    });
  };

  const clearCompare = () => setCompareIds([]);

  const saveCurrentSearch = (customName?: string) => {
    const labelParts = [
      searchFilters.tab.toUpperCase(),
      searchFilters.location || 'All Locations',
      searchFilters.category !== 'all' ? searchFilters.category : 'All Categories'
    ];
    const newSaved: SavedSearch = {
      id: `ss-${Date.now()}`,
      name: customName || labelParts.join(' · '),
      tab: searchFilters.tab,
      location: searchFilters.location,
      category: searchFilters.category,
      minPrice: searchFilters.minPrice ? Number(searchFilters.minPrice) : undefined,
      maxPrice: searchFilters.maxPrice ? Number(searchFilters.maxPrice) : undefined,
      bedrooms: searchFilters.bedrooms ? Number(searchFilters.bedrooms) : undefined,
      guestCapacity: searchFilters.guestCapacity ? Number(searchFilters.guestCapacity) : undefined,
      rentalDuration:
        searchFilters.rentalDuration !== 'all' ? searchFilters.rentalDuration : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSavedSearches((prev) => [newSaved, ...prev]);
    showToast('Search criteria saved to your Customer Dashboard');
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const resetSearchFilters = () => setSearchFilters(DEFAULT_FILTERS);

  const createInquiry = (payload: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message: string;
  }): Inquiry => {
    const prop = properties.find((p) => p.id === payload.propertyId);
    const now = new Date().toISOString();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      propertyId: payload.propertyId,
      propertyReference: prop?.referenceCode || 'MDP-REF',
      propertyTitle: prop?.title || 'Property Inquiry',
      customerId: currentUser.id,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      ownerId: prop?.ownerId || 'own-1',
      subject: `Inquiry regarding ${prop?.title || 'Property'} (${prop?.referenceCode || ''})`,
      initialMessage: payload.message,
      status: 'new',
      createdAt: now,
      updatedAt: now
    };

    const firstMsg: Message = {
      id: `msg-${Date.now()}`,
      inquiryId: newInquiry.id,
      senderId: currentUser.id,
      senderName: payload.customerName,
      senderRole: 'customer',
      content: payload.message,
      createdAt: now
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    setMessages((prev) => [...prev, firstMsg]);
    setProperties((prev) =>
      prev.map((p) =>
        p.id === payload.propertyId ? { ...p, inquiriesCount: p.inquiriesCount + 1 } : p
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'owner',
        title: `New Inquiry: ${prop?.title || 'Property'}`,
        message: `${payload.customerName} submitted an inquiry for ${prop?.referenceCode || ''}.`,
        type: 'inquiry',
        relatedPropertyId: payload.propertyId,
        read: false,
        createdAt: now
      },
      ...prev
    ]);

    showToast(t.modals.inquirySentSuccess);
    return newInquiry;
  };

  const sendMessage = (inquiryId: string, content: string, senderRole: UserRole = activeRole) => {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    const inquiry = inquiries.find((i) => i.id === inquiryId);
    const senderName =
      senderRole === 'customer'
        ? currentUser.name
        : senderRole === 'admin'
          ? 'MY DREAM PLACE Admin'
          : owners.find((o) => o.id === inquiry?.ownerId)?.name || 'Property Owner';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      inquiryId,
      senderId: senderRole === 'customer' ? currentUser.id : inquiry?.ownerId || 'own-1',
      senderName,
      senderRole,
      content: content.trim(),
      createdAt: now
    };

    setMessages((prev) => [...prev, newMsg]);
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId
          ? {
              ...inq,
              status:
                senderRole === 'owner' || senderRole === 'agent' || senderRole === 'admin'
                  ? 'answered'
                  : inq.status,
              updatedAt: now
            }
          : inq
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: senderRole === 'customer' ? 'owner' : 'customer',
        title: `New Message on ${inquiry?.propertyReference || 'Inquiry'}`,
        message: `${senderName}: "${content.slice(0, 70)}${content.length > 70 ? '...' : ''}"`,
        type: 'inquiry',
        relatedPropertyId: inquiry?.propertyId,
        read: false,
        createdAt: now
      },
      ...prev
    ]);
  };

  const updateInquiryStatus = (inquiryId: string, status: Inquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, status, updatedAt: new Date().toISOString() } : inq
      )
    );
    showToast(`Inquiry marked as ${status}`);
  };

  const deleteInquiry = (inquiryId: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
    setMessages((prev) => prev.filter((m) => m.inquiryId !== inquiryId));
    showToast('Inquiry thread deleted');
  };

  const createViewingRequest = (payload: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    preferredDate: string;
    preferredTime: string;
    visitType: ViewingRequest['visitType'];
    guestCount?: number;
    notes?: string;
  }): ViewingRequest => {
    const prop = properties.find((p) => p.id === payload.propertyId);
    const now = new Date().toISOString();
    const req: ViewingRequest = {
      id: `view-${Date.now()}`,
      propertyId: payload.propertyId,
      propertyReference: prop?.referenceCode || 'MDP-REF',
      propertyTitle: prop?.title || 'Property Viewing',
      customerId: currentUser.id,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      ownerId: prop?.ownerId || 'own-1',
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
      visitType: payload.visitType,
      guestCount: payload.guestCount,
      notes: payload.notes,
      status: 'pending',
      createdAt: now
    };

    setViewingRequests((prev) => [req, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'owner',
        title: `Viewing Request: ${prop?.title || 'Property'}`,
        message: `${payload.customerName} requested a ${payload.visitType.replace('_', ' ')} on ${payload.preferredDate} at ${payload.preferredTime}.`,
        type: 'viewing',
        relatedPropertyId: payload.propertyId,
        read: false,
        createdAt: now
      },
      ...prev
    ]);
    showToast(t.modals.viewingSentSuccess);
    return req;
  };

  const updateViewingStatus = (
    requestId: string,
    status: ViewingRequest['status'],
    ownerResponseNote?: string
  ) => {
    const target = viewingRequests.find((v) => v.id === requestId);
    setViewingRequests((prev) =>
      prev.map((v) =>
        v.id === requestId
          ? { ...v, status, ownerResponseNote: ownerResponseNote ?? v.ownerResponseNote }
          : v
      )
    );
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'customer',
          title: `Viewing Request ${status.toUpperCase()}: ${target.propertyTitle}`,
          message:
            ownerResponseNote ||
            `Your viewing request for ${target.preferredDate} at ${target.preferredTime} is now ${status}.`,
          type: 'viewing',
          relatedPropertyId: target.propertyId,
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
    showToast(`Viewing status updated to ${status}`);
  };

  const submitNewProperty = (
    newProp: Omit<
      Property,
      'id' | 'referenceCode' | 'approvalStatus' | 'dateListed' | 'viewsCount' | 'inquiriesCount'
    >,
    autoApprove = false
  ): Property => {
    const nextNumber = properties.length + 1;
    const id = `prop-${Date.now()}`;
    const referenceCode = `MDP-2026-0${nextNumber}`;
    const initialStatus: ApprovalStatus =
      autoApprove || !websiteSettings.requireAdminApprovalForNewListings ? 'approved' : 'pending';

    const created: Property = {
      ...newProp,
      id,
      referenceCode,
      approvalStatus: initialStatus,
      availabilityStatus: newProp.availabilityStatus || 'available',
      dateListed: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      inquiriesCount: 0
    };

    setProperties((prev) => [created, ...prev]);
    setApprovalQueue((prev) => [
      {
        id: `appr-${Date.now()}`,
        propertyId: id,
        propertyTitle: created.title,
        submittedBy: currentUser.name,
        submittedAt: new Date().toISOString(),
        status: initialStatus
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'all',
        title:
          initialStatus === 'approved'
            ? `Listing Published Live (${referenceCode})`
            : `Listing Submitted for Approval (${referenceCode})`,
        message:
          initialStatus === 'approved'
            ? `"${created.title}" is now live in the public marketplace.`
            : `"${created.title}" is now Pending Approval in the Admin Queue.`,
        type: 'approval',
        relatedPropertyId: id,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    showToast(
      initialStatus === 'approved'
        ? `Property "${created.title}" created and published live.`
        : `Property "${created.title}" saved locally with status: Pending Approval.`
    );
    return created;
  };

  const updateProperty = (propertyId: string, patch: Partial<Property>) => {
    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, ...patch } : p)));
    if (patch.approvalStatus) {
      setApprovalQueue((prev) =>
        prev.map((a) =>
          a.propertyId === propertyId
            ? { ...a, status: patch.approvalStatus!, reviewedAt: new Date().toISOString() }
            : a
        )
      );
    }
    showToast('Property listing updated immediately');
  };

  const deleteProperty = (propertyId: string) => {
    const target = properties.find((p) => p.id === propertyId);
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    setApprovalQueue((prev) => prev.filter((a) => a.propertyId !== propertyId));
    setFavorites((prev) => prev.filter((id) => id !== propertyId));
    setCompareIds((prev) => prev.filter((id) => id !== propertyId));
    showToast(`Deleted property "${target?.title || propertyId}"`);
  };

  const reorderFeaturedProperties = (orderedPropertyIds: string[]) => {
    setProperties((prev) => {
      const orderMap = new Map<string, number>();
      orderedPropertyIds.forEach((id, idx) => orderMap.set(id, idx + 1));
      return prev.map((p) =>
        orderMap.has(p.id) ? { ...p, featuredOrder: orderMap.get(p.id) } : p
      );
    });
    showToast('Featured property order updated');
  };

  const reviewPropertyApproval = (
    propertyId: string,
    status: ApprovalStatus,
    reviewerNotes?: string
  ) => {
    const target = properties.find((p) => p.id === propertyId);
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, approvalStatus: status, adminNotes: reviewerNotes ?? p.adminNotes }
          : p
      )
    );
    setApprovalQueue((prev) => {
      const exists = prev.some((item) => item.propertyId === propertyId);
      if (!exists && target) {
        return [
          {
            id: `appr-${Date.now()}`,
            propertyId,
            propertyTitle: target.title,
            submittedBy: 'Owner / Agent',
            submittedAt: new Date().toISOString(),
            status,
            reviewedAt: new Date().toISOString(),
            reviewerNotes
          },
          ...prev
        ];
      }
      return prev.map((item) =>
        item.propertyId === propertyId
          ? {
              ...item,
              status,
              reviewedAt: new Date().toISOString(),
              reviewerNotes
            }
          : item
      );
    });

    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'owner',
          title: `Listing ${status.replace('_', ' ').toUpperCase()}: ${target.title}`,
          message:
            reviewerNotes ||
            (status === 'approved'
              ? `"${target.title}" is now approved and live in public marketplace listings.`
              : `Admin updated status of "${target.title}" to ${status}.`),
          type: 'approval',
          relatedPropertyId: propertyId,
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
    showToast(`Listing "${target?.title || propertyId}" marked as ${status.replace('_', ' ')}.`);
  };

  // Owner, Agent, Customer Management
  const updateOwner = (ownerId: string, patch: Partial<Owner>) => {
    setOwners((prev) => prev.map((o) => (o.id === ownerId ? { ...o, ...patch } : o)));
    setAgents((prev) => prev.map((a) => (a.id === ownerId ? { ...a, ...patch } : a)));
    showToast('Owner / Agent profile updated');
  };

  const addOwner = (ownerData: Omit<Owner, 'id'>): Owner => {
    const created: Owner = {
      ...ownerData,
      id: `own-${Date.now()}`
    };
    setOwners((prev) => [created, ...prev]);
    showToast(`Added owner "${created.name}"`);
    return created;
  };

  const deleteOwner = (ownerId: string) => {
    setOwners((prev) => prev.filter((o) => o.id !== ownerId));
    setAgents((prev) => prev.filter((a) => a.id !== ownerId));
    showToast('Owner removed from directory');
  };

  const updateAgent = (agentId: string, patch: Partial<Agent>) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, ...patch } : a)));
    setOwners((prev) => prev.map((o) => (o.id === agentId ? { ...o, ...patch } : o)));
    showToast('Agent portfolio updated');
  };

  const updateCustomer = (customerId: string, patch: Partial<User>) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, ...patch } : c)));
    if (currentUser.id === customerId) {
      setCurrentUser((prev) => ({ ...prev, ...patch }));
    }
    showToast('Customer record updated');
  };

  const addCustomer = (customerData: Omit<User, 'id' | 'joinedDate'>): User => {
    const created: User = {
      ...customerData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [created, ...prev]);
    showToast(`Added customer "${created.name}"`);
    return created;
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    showToast('Customer profile removed');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const reportProperty = (propertyId: string, reason: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'admin',
        title: `Listing Report Logged: ${prop?.referenceCode || propertyId}`,
        message: `Reason: ${reason}`,
        type: 'system',
        relatedPropertyId: propertyId,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
    showToast('Thank you. Your report has been logged for admin review in this demo.');
  };

  const updateCurrentUser = (patch: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...patch }));
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentUser.id ? { ...c, ...patch } : c))
    );
    showToast('Profile preferences saved');
  };

  const resetDemoData = () => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_PREFIX) || k.startsWith('mdp_demo_v1_')) {
        localStorage.removeItem(k);
      }
    });
    clearAllMediaAssetsFromDB();
    setMediaAssets(DEFAULT_MEDIA_ASSETS);
    setLanguageState('en');
    setCurrencyState('USD');
    setCurrentUser(INITIAL_USER);
    setActiveRoleState('customer');
    setProperties(INITIAL_PROPERTIES);
    setOwners(INITIAL_OWNERS);
    setAgents(INITIAL_AGENTS);
    setCustomers(INITIAL_CUSTOMERS);
    setFavorites(['prop-101', 'prop-103']);
    setCompareIds([]);
    setSavedSearches(INITIAL_SAVED_SEARCHES);
    setInquiries(INITIAL_INQUIRIES);
    setMessages(INITIAL_MESSAGES);
    setViewingRequests(INITIAL_VIEWING_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setApprovalQueue(INITIAL_APPROVAL_QUEUE);

    setPublishedWebsiteContent(INITIAL_WEBSITE_CONTENT);
    setPublishedBranding(INITIAL_BRANDING);
    setPublishedNavigationConfig(INITIAL_NAVIGATION_CONFIG);
    setPublishedWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
    setPublishedCustomTranslations(INITIAL_CUSTOM_TRANSLATIONS);

    setDraftWebsiteContent(INITIAL_WEBSITE_CONTENT);
    setDraftBranding(INITIAL_BRANDING);
    setDraftNavigationConfig(INITIAL_NAVIGATION_CONFIG);
    setDraftWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
    setDraftCustomTranslations(INITIAL_CUSTOM_TRANSLATIONS);
    setPreviousPublishedSnapshot(null);
    setIsDraftPreviewMode(false);
    setSearchFilters(DEFAULT_FILTERS);
    showToast('Demo data restored to original factory defaults.');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatPrice,
        currentUser,
        updateCurrentUser,
        activeRole,
        setActiveRole,
        properties,
        publicProperties,
        owners,
        agents,
        customers,
        favorites,
        toggleFavorite,
        compareIds,
        toggleCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        savedSearches,
        saveCurrentSearch,
        deleteSavedSearch,
        inquiries,
        messages,
        viewingRequests,
        notifications,
        approvalQueue,
        websiteContent,
        branding,
        navigationConfig,
        websiteSettings,
        customTranslations,
        draftWebsiteContent,
        draftBranding,
        draftNavigationConfig,
        draftWebsiteSettings,
        draftCustomTranslations,
        isDraftPreviewMode,
        setIsDraftPreviewMode,
        hasUnsavedDraftChanges,
        previousPublishedSnapshot,
        lastPublishedAt,
        updateDraftWebsiteContent,
        updateDraftBranding,
        updateDraftNavigationConfig,
        updateDraftWebsiteSettings,
        updateDraftTranslation,
        saveDraftChanges,
        publishDraftChanges,
        discardDraftChanges,
        restorePreviousVersion,
        updateWebsiteContent,
        updateBranding,
        mediaAssets,
        uploadMediaFromDevice,
        replaceMediaAssetFile,
        removeMediaAsset,
        registerExternalMediaUrl,
        searchFilters,
        setSearchFilters,
        resetSearchFilters,
        createInquiry,
        sendMessage,
        updateInquiryStatus,
        deleteInquiry,
        createViewingRequest,
        updateViewingStatus,
        submitNewProperty,
        updateProperty,
        deleteProperty,
        reorderFeaturedProperties,
        reviewPropertyApproval,
        updateOwner,
        addOwner,
        deleteOwner,
        updateAgent,
        updateCustomer,
        addCustomer,
        deleteCustomer,
        markNotificationRead,
        markAllNotificationsRead,
        reportProperty,
        resetDemoData,
        authModalMode,
        setAuthModalMode,
        toastMessage,
        showToast
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextValue => {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error('useMarketplace must be used inside a MarketplaceProvider');
  }
  return ctx;
};
