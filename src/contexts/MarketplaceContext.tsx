import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch
} from 'firebase/firestore';
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
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  FirebaseUser,
  handleFirestoreError,
  onAuthStateChanged,
  OperationType,
  sanitizeForFirestore,
  serverTimestamp,
  signInWithGooglePopup,
  signOutFromFirebase,
  uploadFileToFirebaseStorage
} from '../lib/firebase';

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

function sanitizePropertyPayload(prop: Property) {
  return sanitizeForFirestore({
    id: prop.id.slice(0, 128),
    referenceCode: (prop.referenceCode || 'MDP-2026').slice(0, 32),
    title: (prop.title || 'Untitled Property').slice(0, 160),
    ...(prop.subtitle ? { subtitle: prop.subtitle.slice(0, 240) } : {}),
    category: prop.category,
    listingType: prop.listingType,
    priceUSD: Math.max(0, Math.min(500000000, Number(prop.priceUSD) || 0)),
    ...(prop.priceUnit ? { priceUnit: prop.priceUnit } : {}),
    ...(prop.rentalDuration ? { rentalDuration: prop.rentalDuration } : {}),
    location: {
      country: (prop.location.country || 'Dominican Republic').slice(0, 80),
      ...(prop.location.province ? { province: prop.location.province.slice(0, 80) } : {}),
      city: (prop.location.city || 'Cap Cana').slice(0, 80),
      neighborhood: (prop.location.neighborhood || '').slice(0, 120),
      address: (prop.location.address || '').slice(0, 200),
      coordinates: prop.location.coordinates || null,
      locationAccuracy: prop.location.locationAccuracy || 'approximate'
    },
    specs: {
      ...prop.specs,
      areaSqm: Math.max(1, Math.min(50000000, Number(prop.specs.areaSqm) || 200))
    },
    description: (prop.description || 'Architectural property listing.').slice(0, 5000),
    highlights: (prop.highlights || []).slice(0, 15).map((h) => String(h).slice(0, 200)),
    amenities: (prop.amenities || []).slice(0, 30).map((a) => String(a).slice(0, 80)),
    images:
      prop.images && prop.images.length > 0
        ? prop.images.slice(0, 20).map((img) => String(img).slice(0, 240000))
        : ['https://cdn.sceneai.art/Bg%20images/c789ac4d-f2c8-463a-93f6-1f8c6fa09f9a.png'],
    ...(prop.videoUrl ? { videoUrl: prop.videoUrl.slice(0, 1000) } : {}),
    ownerId: (prop.ownerId || 'own-1').slice(0, 128),
    ...(prop.agentId ? { agentId: prop.agentId.slice(0, 128) } : {}),
    approvalStatus: prop.approvalStatus || 'pending',
    availabilityStatus: prop.availabilityStatus || 'available',
    ...(prop.adminNotes ? { adminNotes: prop.adminNotes.slice(0, 1000) } : {}),
    featured: Boolean(prop.featured),
    ...(prop.featuredOrder !== undefined ? { featuredOrder: Number(prop.featuredOrder) } : {}),
    dateListed: (prop.dateListed || new Date().toISOString().split('T')[0]).slice(0, 32),
    viewsCount: Math.max(0, Number(prop.viewsCount) || 0),
    inquiriesCount: Math.max(0, Number(prop.inquiriesCount) || 0),
    updatedAt: serverTimestamp()
  });
}

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

  // Firebase Auth & Firestore Status
  firebaseUser: FirebaseUser | null;
  isAuthReady: boolean;
  isCloudConnected: boolean;
  isVerifiedAdmin: boolean;
  authorizedAdminEmails: string[];
  addAdminByEmail: (email: string, name?: string) => void;
  removeAdminByEmail: (email: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  logoutAdminSession: () => Promise<void>;
  syncSeedCatalogToFirestore: () => Promise<void>;

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

  // Media Library
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
    // Ignore storage quota errors
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

  // Firebase Auth & Cloud Firestore state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState<boolean>(false);

  const [properties, setProperties] = useState<Property[]>(() => {
    const stored = loadFromStorage<Property[]>('properties', INITIAL_PROPERTIES);
    return stored.map((item) => {
      const seed = INITIAL_PROPERTIES.find((s) => s.id === item.id);
      if (!seed) return item;
      if (
        !item.location.province ||
        (item.id === 'prop-101' &&
          (item.location.coordinates?.lat !== 18.5 ||
            item.location.coordinates?.lng !== -68.3895)) ||
        (item.id === 'prop-109' && item.location.city !== 'Port-au-Prince') ||
        (item.id === 'prop-110' &&
          item.location.coordinates?.lat !== 18.5601)
      ) {
        return {
          ...item,
          location: {
            ...seed.location
          }
        };
      }
      return item;
    });
  });
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

  // Media Library Assets (IndexedDB + Cloud Storage)
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

  // ---------------------------------------------------------------------------
  const authorizedAdminEmails = useMemo(() => {
    const rawList =
      publishedWebsiteSettings.authorizedAdminEmails ||
      draftWebsiteSettings.authorizedAdminEmails || [BOOTSTRAPPED_ADMIN_EMAIL];
    const normalized = rawList
      .map((e) => String(e || '').trim().toLowerCase())
      .filter(Boolean);
    if (!normalized.includes(BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase())) {
      normalized.unshift(BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase());
    }
    return Array.from(new Set(normalized));
  }, [
    publishedWebsiteSettings.authorizedAdminEmails,
    draftWebsiteSettings.authorizedAdminEmails
  ]);

  // 1. FIREBASE AUTHENTICATION & USER PROFILE LIFECYCLE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setIsVerifiedAdmin(false);
        setIsAuthReady(true);
        return;
      }

      const normalizedUserEmail = (fbUser.email || '').trim().toLowerCase();
      const isBootstrapAdmin =
        normalizedUserEmail === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() &&
        fbUser.emailVerified;

      // Also check if user email is in published cms_config authorizedAdminEmails
      let isAuthorizedByEmailList = authorizedAdminEmails.includes(normalizedUserEmail);
      if (!isAuthorizedByEmailList && fbUser.emailVerified) {
        try {
          const cmsSnap = await getDoc(doc(db, 'cms_config', 'published'));
          if (cmsSnap.exists()) {
            const cmsData = cmsSnap.data();
            const remoteEmails: string[] = Array.isArray(
              cmsData?.websiteSettings?.authorizedAdminEmails
            )
              ? cmsData.websiteSettings.authorizedAdminEmails.map((e: string) =>
                  String(e).trim().toLowerCase()
                )
              : [];
            if (remoteEmails.includes(normalizedUserEmail)) {
              isAuthorizedByEmailList = true;
            }
          }
        } catch {
          // Ignore read error during bootstrap check
        }
      }

      let adminStatus = Boolean(
        fbUser.emailVerified && (isBootstrapAdmin || isAuthorizedByEmailList)
      );
      try {
        const adminDocRef = doc(db, 'admins', fbUser.uid);
        const adminSnap = await getDoc(adminDocRef);
        if (adminSnap.exists()) {
          adminStatus = true;
        } else if (adminStatus) {
          await setDoc(adminDocRef, {
            uid: fbUser.uid,
            email: normalizedUserEmail || BOOTSTRAPPED_ADMIN_EMAIL,
            createdAt: serverTimestamp()
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `admins/${fbUser.uid}`);
      }

      setIsVerifiedAdmin(adminStatus);

      // Sync /users/{uid} profile document
      const userDocPath = `users/${fbUser.uid}`;
      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data() as Partial<User> & { favorites?: string[] };
          const resolvedRole: UserRole = adminStatus
            ? 'admin'
            : (data.role as UserRole) || 'customer';
          setCurrentUser((prev) => ({
            ...prev,
            id: fbUser.uid,
            name: data.name || fbUser.displayName || prev.name,
            email: data.email || fbUser.email || prev.email,
            phone: data.phone || prev.phone,
            role: resolvedRole,
            preferredLanguage: data.preferredLanguage || language,
            preferredCurrency: data.preferredCurrency || currency,
            verified: true
          }));
          setActiveRoleState(resolvedRole);
          if (Array.isArray(data.favorites)) {
            setFavorites(data.favorites.slice(0, 100));
          }
        } else {
          const initialRole: UserRole = adminStatus ? 'admin' : 'customer';
          const newProfile = sanitizeForFirestore({
            id: fbUser.uid,
            name: (fbUser.displayName || 'Verified Member').slice(0, 120),
            email: (fbUser.email || 'user@example.com').slice(0, 254),
            phone: currentUser.phone ? currentUser.phone.slice(0, 40) : '',
            role: initialRole,
            preferredLanguage: language,
            preferredCurrency: currency,
            favorites: favorites.slice(0, 100),
            joinedDate: new Date().toISOString().split('T')[0],
            verified: true,
            updatedAt: serverTimestamp()
          });
          await setDoc(userRef, newProfile);
          setCurrentUser((prev) => ({
            ...prev,
            id: fbUser.uid,
            name: fbUser.displayName || prev.name,
            email: fbUser.email || prev.email,
            role: initialRole,
            verified: true
          }));
          setActiveRoleState(initialRole);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, userDocPath);
      }

      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Re-evaluate admin status if authorizedAdminEmails changes while signed in
  useEffect(() => {
    if (!firebaseUser || !firebaseUser.emailVerified) return;
    const emailLower = (firebaseUser.email || '').trim().toLowerCase();
    if (authorizedAdminEmails.includes(emailLower) && !isVerifiedAdmin) {
      setIsVerifiedAdmin(true);
      setActiveRoleState('admin');
      setCurrentUser((prev) => ({ ...prev, role: 'admin' }));
    }
  }, [authorizedAdminEmails, firebaseUser, isVerifiedAdmin]);

  // ---------------------------------------------------------------------------
  // 2. REAL-TIME CLOUD FIRESTORE LISTENERS (Properties, CMS, Inquiries, Viewings)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthReady) return;

    const unsubscribers: Array<() => void> = [];

    // A. Published CMS Config Listener (Accessible to all visitors)
    const publishedCmsPath = 'cms_config/published';
    const unsubPublishedCms = onSnapshot(
      doc(db, 'cms_config', 'published'),
      (snap) => {
        setIsCloudConnected(true);
        if (snap.exists()) {
          const data = snap.data();
          if (data.websiteContent) setPublishedWebsiteContent(data.websiteContent as WebsiteContent);
          if (data.branding) setPublishedBranding(data.branding as BrandingSettings);
          if (data.navigationConfig) {
            setPublishedNavigationConfig(data.navigationConfig as NavigationConfig);
          }
          if (data.websiteSettings) {
            setPublishedWebsiteSettings(data.websiteSettings as WebsiteSettings);
          }
          if (data.customTranslations) {
            setPublishedCustomTranslations(data.customTranslations as CustomTranslations);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, publishedCmsPath);
      }
    );
    unsubscribers.push(unsubPublishedCms);

    const canListAllPropertiesAsAdmin = Boolean(
      firebaseUser && isVerifiedAdmin && firebaseUser.emailVerified
    );

    const canListAllInquiriesAsBootstrapAdmin = Boolean(
      firebaseUser &&
        isVerifiedAdmin &&
        firebaseUser.email === BOOTSTRAPPED_ADMIN_EMAIL &&
        firebaseUser.emailVerified
    );

    // B. Properties Listener (Admin reads all; Public/Visitor queries approved; Owner also queries own)
    const propertiesPath = 'properties';
    if (canListAllPropertiesAsAdmin) {
      const unsubAllProps = onSnapshot(
        collection(db, 'properties'),
        (snap) => {
          setIsCloudConnected(true);
          if (!snap.empty) {
            const remoteProps = snap.docs.map((d) => {
              const raw = d.data() as Property;
              return { ...raw, id: d.id };
            });
            setProperties((prev) => {
              const remoteIds = new Set(remoteProps.map((r) => r.id));
              const localRemaining = prev.filter((p) => !remoteIds.has(p.id));
              return [...remoteProps, ...localRemaining];
            });
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, propertiesPath);
        }
      );
      unsubscribers.push(unsubAllProps);
    } else {
      const approvedQuery = query(
        collection(db, 'properties'),
        where('approvalStatus', '==', 'approved')
      );
      const unsubApprovedProps = onSnapshot(
        approvedQuery,
        (snap) => {
          setIsCloudConnected(true);
          if (!snap.empty) {
            const remoteApproved = snap.docs.map((d) => {
              const raw = d.data() as Property;
              return { ...raw, id: d.id };
            });
            setProperties((prev) => {
              const remoteIds = new Set(remoteApproved.map((r) => r.id));
              const remaining = prev.filter((p) => !remoteIds.has(p.id));
              return [...remoteApproved, ...remaining];
            });
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, propertiesPath);
        }
      );
      unsubscribers.push(unsubApprovedProps);

      if (firebaseUser) {
        const ownPropsQuery = query(
          collection(db, 'properties'),
          where('ownerId', '==', firebaseUser.uid)
        );
        const unsubOwnProps = onSnapshot(
          ownPropsQuery,
          (snap) => {
            if (!snap.empty) {
              const ownRemote = snap.docs.map((d) => ({
                ...(d.data() as Property),
                id: d.id
              }));
              setProperties((prev) => {
                const remoteIds = new Set(ownRemote.map((r) => r.id));
                const remaining = prev.filter((p) => !remoteIds.has(p.id));
                return [...ownRemote, ...remaining];
              });
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, propertiesPath);
          }
        );
        unsubscribers.push(unsubOwnProps);
      }
    }

    // C. Authenticated Listeners for Inquiries & Viewing Requests
    if (firebaseUser) {
      const inquiriesPath = 'inquiries';
      const viewingsPath = 'viewing_requests';

      if (canListAllInquiriesAsBootstrapAdmin) {
        const unsubInq = onSnapshot(
          collection(db, 'inquiries'),
          (snap) => {
            if (!snap.empty) {
              const remote = snap.docs.map((d) => ({ ...(d.data() as Inquiry), id: d.id }));
              setInquiries((prev) => {
                const remoteIds = new Set(remote.map((r) => r.id));
                return [...remote, ...prev.filter((i) => !remoteIds.has(i.id))];
              });
            }
          },
          (error) => handleFirestoreError(error, OperationType.LIST, inquiriesPath)
        );
        unsubscribers.push(unsubInq);

        const unsubView = onSnapshot(
          collection(db, 'viewing_requests'),
          (snap) => {
            if (!snap.empty) {
              const remote = snap.docs.map((d) => ({ ...(d.data() as ViewingRequest), id: d.id }));
              setViewingRequests((prev) => {
                const remoteIds = new Set(remote.map((r) => r.id));
                return [...remote, ...prev.filter((v) => !remoteIds.has(v.id))];
              });
            }
          },
          (error) => handleFirestoreError(error, OperationType.LIST, viewingsPath)
        );
        unsubscribers.push(unsubView);
      } else {
        const custInqQuery = query(
          collection(db, 'inquiries'),
          where('customerId', '==', firebaseUser.uid)
        );
        const unsubCustInq = onSnapshot(
          custInqQuery,
          (snap) => {
            if (!snap.empty) {
              const remote = snap.docs.map((d) => ({ ...(d.data() as Inquiry), id: d.id }));
              setInquiries((prev) => {
                const remoteIds = new Set(remote.map((r) => r.id));
                return [...remote, ...prev.filter((i) => !remoteIds.has(i.id))];
              });
            }
          },
          (error) => handleFirestoreError(error, OperationType.LIST, inquiriesPath)
        );
        unsubscribers.push(unsubCustInq);

        const custViewQuery = query(
          collection(db, 'viewing_requests'),
          where('customerId', '==', firebaseUser.uid)
        );
        const unsubCustView = onSnapshot(
          custViewQuery,
          (snap) => {
            if (!snap.empty) {
              const remote = snap.docs.map((d) => ({ ...(d.data() as ViewingRequest), id: d.id }));
              setViewingRequests((prev) => {
                const remoteIds = new Set(remote.map((r) => r.id));
                return [...remote, ...prev.filter((v) => !remoteIds.has(v.id))];
              });
            }
          },
          (error) => handleFirestoreError(error, OperationType.LIST, viewingsPath)
        );
        unsubscribers.push(unsubCustView);
      }
    }

    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [isAuthReady, firebaseUser, isVerifiedAdmin]);

  // Sign-In & Sign-Out Actions
  const signInWithGoogle = async () => {
    try {
      const user = await signInWithGooglePopup();
      showToast(`Signed in as ${user.displayName || user.email}`);
      setAuthModalMode(null);
    } catch (error) {
      showToast(
        error instanceof Error
          ? `Google Sign-In did not complete: ${error.message}`
          : 'Google Sign-In was cancelled.'
      );
    }
  };

  const signOutFirebase = async () => {
    try {
      await signOutFromFirebase();
    } catch {
      // Ignore if not signed into Firebase
    }
    setFirebaseUser(null);
    setIsVerifiedAdmin(false);
    setIsDraftPreviewMode(false);
    setActiveRoleState('customer');
    setCurrentUser((prev) => ({ ...prev, role: 'customer' }));
    try {
      localStorage.setItem(STORAGE_PREFIX + 'role', JSON.stringify('customer'));
    } catch {
      // Ignore storage errors
    }
    showToast('Signed out of Admin & Firebase session.');
  };

  const logoutAdminSession = async () => {
    await signOutFirebase();
    showToast('Logged out of Admin session. Returning to public website.');
  };

  // Seed / Sync Initial Catalog & CMS Config to Cloud Firestore (Admin action)
  const syncSeedCatalogToFirestore = async () => {
    if (!firebaseUser || !isVerifiedAdmin) {
      showToast('Please sign in with an Admin Google account first to seed Cloud Firestore.');
      return;
    }

    try {
      const batch = writeBatch(db);
      for (const prop of properties) {
        const propRef = doc(db, 'properties', prop.id);
        batch.set(propRef, sanitizePropertyPayload(prop));
      }

      const publishedRef = doc(db, 'cms_config', 'published');
      batch.set(
        publishedRef,
        sanitizeForFirestore({
          id: 'published',
          websiteContent: publishedWebsiteContent,
          branding: publishedBranding,
          navigationConfig: publishedNavigationConfig,
          websiteSettings: publishedWebsiteSettings,
          customTranslations: publishedCustomTranslations,
          updatedBy: firebaseUser.uid,
          updatedAt: serverTimestamp()
        })
      );

      await batch.commit();
      showToast(
        `Synced ${properties.length} properties & published CMS configuration to Cloud Firestore!`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'properties');
    }
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

    if (firebaseUser && isVerifiedAdmin) {
      const draftPath = 'cms_config/draft';
      setDoc(
        doc(db, 'cms_config', 'draft'),
        sanitizeForFirestore({
          id: 'draft',
          websiteContent: draftWebsiteContent,
          branding: draftBranding,
          navigationConfig: draftNavigationConfig,
          websiteSettings: draftWebsiteSettings,
          customTranslations: draftCustomTranslations,
          updatedBy: firebaseUser.uid,
          updatedAt: serverTimestamp()
        })
      ).catch((error) => handleFirestoreError(error, OperationType.WRITE, draftPath));
    }

    showToast('Draft saved. Use Preview or Publish when ready.');
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

    if (firebaseUser && isVerifiedAdmin) {
      const pubPath = 'cms_config/published';
      setDoc(
        doc(db, 'cms_config', 'published'),
        sanitizeForFirestore({
          id: 'published',
          websiteContent: draftWebsiteContent,
          branding: draftBranding,
          navigationConfig: draftNavigationConfig,
          websiteSettings: draftWebsiteSettings,
          customTranslations: draftCustomTranslations,
          updatedBy: firebaseUser.uid,
          updatedAt: serverTimestamp()
        })
      ).catch((error) => handleFirestoreError(error, OperationType.WRITE, pubPath));
    }

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
      showToast('Restored default website version.');
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

  // Media Library Handlers (Uploads to Firebase Cloud Storage when authenticated, with IndexedDB persistence)
  const uploadMediaFromDevice = async (
    file: File,
    category: MediaAsset['category'] = 'general',
    usedIn?: string
  ): Promise<MediaAsset> => {
    const currentTotalBytes = mediaAssets.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
    const { asset } = await validateAndReadMediaFile(file, currentTotalBytes);

    let resolvedUrl = asset.url;
    if (firebaseUser) {
      try {
        resolvedUrl = await uploadFileToFirebaseStorage(file, `media/${category}`);
      } catch {
        // Fallback to local Data URL if Cloud Storage bucket is not yet initialized
      }
    }

    const enriched: MediaAsset = {
      ...asset,
      url: resolvedUrl,
      category,
      usedIn: usedIn || 'Uploaded from Device'
    };
    await saveMediaAsset(enriched);
    setMediaAssets((prev) => [enriched, ...prev]);
    showToast(`Uploaded "${enriched.name}" to Media Library`);
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

      if (firebaseUser) {
        const userDocPath = `users/${firebaseUser.uid}`;
        setDoc(
          doc(db, 'users', firebaseUser.uid),
          sanitizeForFirestore({
            id: firebaseUser.uid,
            name: (currentUser.name || firebaseUser.displayName || 'Member').slice(0, 120),
            email: (currentUser.email || firebaseUser.email || 'user@example.com').slice(0, 254),
            phone: (currentUser.phone || '').slice(0, 40),
            role: isVerifiedAdmin ? 'admin' : currentUser.role || 'customer',
            preferredLanguage: language,
            preferredCurrency: currency,
            favorites: next.slice(0, 100),
            updatedAt: serverTimestamp()
          }),
          { merge: true }
        ).catch((error) => handleFirestoreError(error, OperationType.UPDATE, userDocPath));
      }

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
    const resolvedCustomerId = firebaseUser?.uid || currentUser.id;
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      propertyId: payload.propertyId,
      propertyReference: (prop?.referenceCode || 'MDP-REF').slice(0, 32),
      propertyTitle: (prop?.title || 'Property Inquiry').slice(0, 160),
      customerId: resolvedCustomerId,
      customerName: payload.customerName.trim().slice(0, 120),
      customerEmail: payload.customerEmail.trim().slice(0, 254),
      customerPhone: payload.customerPhone?.trim().slice(0, 40),
      ownerId: prop?.ownerId || 'own-1',
      subject: `Inquiry regarding ${prop?.title || 'Property'} (${prop?.referenceCode || ''})`.slice(
        0,
        200
      ),
      initialMessage: payload.message.trim().slice(0, 2000),
      status: 'new',
      createdAt: now,
      updatedAt: now
    };

    const firstMsg: Message = {
      id: `msg-${Date.now()}`,
      inquiryId: newInquiry.id,
      senderId: resolvedCustomerId,
      senderName: newInquiry.customerName,
      senderRole: 'customer',
      content: newInquiry.initialMessage,
      createdAt: now
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    setMessages((prev) => [...prev, firstMsg]);
    setProperties((prev) =>
      prev.map((p) =>
        p.id === payload.propertyId ? { ...p, inquiriesCount: p.inquiriesCount + 1 } : p
      )
    );

    if (firebaseUser) {
      const inqPath = `inquiries/${newInquiry.id}`;
      // Ensure referenced property exists in Firestore first if it was only in local seed
      const propRef = doc(db, 'properties', payload.propertyId);
      getDoc(propRef)
        .then(async (propSnap) => {
          if (propSnap.exists()) {
            await setDoc(doc(db, 'inquiries', newInquiry.id), sanitizeForFirestore(newInquiry));
          }
        })
        .catch((error) => handleFirestoreError(error, OperationType.CREATE, inqPath));
    }

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

    const resolvedSenderId =
      firebaseUser?.uid ||
      (senderRole === 'customer' ? currentUser.id : inquiry?.ownerId || 'own-1');

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      inquiryId,
      senderId: resolvedSenderId,
      senderName: senderName.slice(0, 120),
      senderRole,
      content: content.trim().slice(0, 2000),
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

    if (firebaseUser && inquiry) {
      const msgPath = `inquiries/${inquiryId}/messages/${newMsg.id}`;
      getDoc(doc(db, 'inquiries', inquiryId))
        .then(async (inqSnap) => {
          if (inqSnap.exists()) {
            await setDoc(
              doc(db, 'inquiries', inquiryId, 'messages', newMsg.id),
              sanitizeForFirestore({
                ...newMsg,
                customerId: inquiry.customerId,
                ownerId: inquiry.ownerId
              })
            );
          }
        })
        .catch((error) => handleFirestoreError(error, OperationType.CREATE, msgPath));
    }

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
    const now = new Date().toISOString();
    const target = inquiries.find((i) => i.id === inquiryId);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status, updatedAt: now } : inq))
    );

    if (firebaseUser && target) {
      const inqPath = `inquiries/${inquiryId}`;
      getDoc(doc(db, 'inquiries', inquiryId))
        .then(async (snap) => {
          if (snap.exists()) {
            await setDoc(
              doc(db, 'inquiries', inquiryId),
              sanitizeForFirestore({ ...target, status, updatedAt: now })
            );
          }
        })
        .catch((error) => handleFirestoreError(error, OperationType.UPDATE, inqPath));
    }

    showToast(`Inquiry marked as ${status}`);
  };

  const deleteInquiry = (inquiryId: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
    setMessages((prev) => prev.filter((m) => m.inquiryId !== inquiryId));
    if (firebaseUser && isVerifiedAdmin) {
      deleteDoc(doc(db, 'inquiries', inquiryId)).catch((error) =>
        handleFirestoreError(error, OperationType.DELETE, `inquiries/${inquiryId}`)
      );
    }
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
    const resolvedCustomerId = firebaseUser?.uid || currentUser.id;
    const req: ViewingRequest = {
      id: `view-${Date.now()}`,
      propertyId: payload.propertyId,
      propertyReference: (prop?.referenceCode || 'MDP-REF').slice(0, 32),
      propertyTitle: (prop?.title || 'Property Viewing').slice(0, 160),
      customerId: resolvedCustomerId,
      customerName: payload.customerName.trim().slice(0, 120),
      customerEmail: payload.customerEmail.trim().slice(0, 254),
      customerPhone: payload.customerPhone.trim().slice(0, 40),
      ownerId: prop?.ownerId || 'own-1',
      preferredDate: payload.preferredDate.slice(0, 32),
      preferredTime: payload.preferredTime.slice(0, 32),
      visitType: payload.visitType,
      guestCount: payload.guestCount,
      notes: payload.notes?.trim().slice(0, 1000),
      status: 'pending',
      createdAt: now
    };

    setViewingRequests((prev) => [req, ...prev]);

    if (firebaseUser) {
      const viewPath = `viewing_requests/${req.id}`;
      getDoc(doc(db, 'properties', payload.propertyId))
        .then(async (propSnap) => {
          if (propSnap.exists()) {
            await setDoc(doc(db, 'viewing_requests', req.id), sanitizeForFirestore(req));
          }
        })
        .catch((error) => handleFirestoreError(error, OperationType.CREATE, viewPath));
    }

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

    if (firebaseUser && target) {
      const viewPath = `viewing_requests/${requestId}`;
      getDoc(doc(db, 'viewing_requests', requestId))
        .then(async (snap) => {
          if (snap.exists()) {
            await setDoc(
              doc(db, 'viewing_requests', requestId),
              sanitizeForFirestore({
                ...target,
                status,
                ownerResponseNote: (ownerResponseNote ?? target.ownerResponseNote ?? '').slice(
                  0,
                  1000
                )
              })
            );
          }
        })
        .catch((error) => handleFirestoreError(error, OperationType.UPDATE, viewPath));
    }

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
    const canAutoApprove = (autoApprove && isVerifiedAdmin) || !websiteSettings.requireAdminApprovalForNewListings;
    const initialStatus: ApprovalStatus = canAutoApprove ? 'approved' : 'pending';
    const resolvedOwnerId = firebaseUser ? firebaseUser.uid : newProp.ownerId || 'own-1';

    const created: Property = {
      ...newProp,
      id,
      referenceCode,
      ownerId: resolvedOwnerId,
      approvalStatus: firebaseUser && !isVerifiedAdmin ? 'pending' : initialStatus,
      featured: firebaseUser && !isVerifiedAdmin ? false : Boolean(newProp.featured),
      availabilityStatus: newProp.availabilityStatus || 'available',
      dateListed: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      inquiriesCount: 0
    };

    setProperties((prev) => [created, ...prev]);

    if (firebaseUser) {
      const propPath = `properties/${created.id}`;
      setDoc(doc(db, 'properties', created.id), sanitizePropertyPayload(created)).catch((error) =>
        handleFirestoreError(error, OperationType.CREATE, propPath)
      );
    }

    setApprovalQueue((prev) => [
      {
        id: `appr-${Date.now()}`,
        propertyId: id,
        propertyTitle: created.title,
        submittedBy: currentUser.name,
        submittedAt: new Date().toISOString(),
        status: created.approvalStatus
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'all',
        title:
          created.approvalStatus === 'approved'
            ? `Listing Published Live (${referenceCode})`
            : `Listing Submitted for Approval (${referenceCode})`,
        message:
          created.approvalStatus === 'approved'
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
      created.approvalStatus === 'approved'
        ? `Property "${created.title}" created and published live.`
        : `Property "${created.title}" submitted with status: Pending Approval.`
    );
    return created;
  };

  const updateProperty = (propertyId: string, patch: Partial<Property>) => {
    const existingProp = properties.find((p) => p.id === propertyId);
    const updatedProp: Property | null = existingProp ? { ...existingProp, ...patch } : null;

    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, ...patch } : p)));

    if (firebaseUser && updatedProp && (isVerifiedAdmin || updatedProp.ownerId === firebaseUser.uid)) {
      const propPath = `properties/${propertyId}`;
      const payloadToSave = isVerifiedAdmin
        ? sanitizePropertyPayload(updatedProp)
        : sanitizePropertyPayload({
            ...updatedProp,
            approvalStatus: 'pending',
            featured: existingProp?.featured ?? false
          });
      setDoc(doc(db, 'properties', propertyId), payloadToSave).catch((error) =>
        handleFirestoreError(error, OperationType.UPDATE, propPath)
      );
    }

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

    if (firebaseUser && target && (isVerifiedAdmin || target.ownerId === firebaseUser.uid)) {
      const propPath = `properties/${propertyId}`;
      deleteDoc(doc(db, 'properties', propertyId)).catch((error) =>
        handleFirestoreError(error, OperationType.DELETE, propPath)
      );
    }

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

    if (firebaseUser && isVerifiedAdmin && target) {
      const propPath = `properties/${propertyId}`;
      setDoc(
        doc(db, 'properties', propertyId),
        sanitizePropertyPayload({
          ...target,
          approvalStatus: status,
          adminNotes: reviewerNotes ?? target.adminNotes
        })
      ).catch((error) => handleFirestoreError(error, OperationType.UPDATE, propPath));
    }

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

  const syncAuthorizedAdminEmails = (nextEmails: string[]) => {
    const cleaned = Array.from(
      new Set([
        BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase(),
        ...nextEmails.map((e) => e.trim().toLowerCase()).filter(Boolean)
      ])
    );
    const nextSettings: WebsiteSettings = {
      ...publishedWebsiteSettings,
      authorizedAdminEmails: cleaned
    };
    setPublishedWebsiteSettings(nextSettings);
    setDraftWebsiteSettings((prev) => ({
      ...prev,
      authorizedAdminEmails: cleaned
    }));

    if (firebaseUser && isVerifiedAdmin) {
      const publishedPath = 'cms_config/published';
      setDoc(
        doc(db, 'cms_config', 'published'),
        sanitizeForFirestore({
          id: 'published',
          websiteContent: publishedWebsiteContent,
          branding: publishedBranding,
          navigationConfig: publishedNavigationConfig,
          websiteSettings: nextSettings,
          customTranslations: publishedCustomTranslations,
          updatedBy: firebaseUser.uid,
          updatedAt: serverTimestamp()
        })
      ).catch((error) => handleFirestoreError(error, OperationType.WRITE, publishedPath));
    }
  };

  const addAdminByEmail = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address for the new administrator.');
      return;
    }
    const nextEmails = [...authorizedAdminEmails, cleanEmail];
    syncAuthorizedAdminEmails(nextEmails);

    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.trim().toLowerCase() === cleanEmail);
      if (existing) {
        return prev.map((c) =>
          c.email.trim().toLowerCase() === cleanEmail
            ? { ...c, role: 'admin', verified: true }
            : c
        );
      }
      const newAdminUser: User = {
        id: `usr-admin-${Date.now()}`,
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '+1 (809) 555-0100',
        role: 'admin',
        preferredLanguage: language,
        preferredCurrency: currency,
        verified: true,
        joinedDate: new Date().toISOString().split('T')[0],
        bio: 'Authorized Platform Administrator'
      };
      return [newAdminUser, ...prev];
    });

    showToast(`Added ${cleanEmail} as an authorized Administrator.`);
  };

  const removeAdminByEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
      showToast('Primary Owner Admin account cannot be removed.');
      return;
    }
    const nextEmails = authorizedAdminEmails.filter((e) => e !== cleanEmail);
    syncAuthorizedAdminEmails(nextEmails);

    setCustomers((prev) =>
      prev.map((c) =>
        c.email.trim().toLowerCase() === cleanEmail && c.role === 'admin'
          ? { ...c, role: 'customer' }
          : c
      )
    );
    showToast(`Removed Admin privileges from ${cleanEmail}.`);
  };

  const updateCustomer = (customerId: string, patch: Partial<User>) => {
    const target = customers.find((c) => c.id === customerId);
    const mergedEmail = (patch.email ?? target?.email ?? '').trim().toLowerCase();
    const nextRole = patch.role ?? target?.role;

    if (mergedEmail && nextRole === 'admin' && !authorizedAdminEmails.includes(mergedEmail)) {
      syncAuthorizedAdminEmails([...authorizedAdminEmails, mergedEmail]);
    } else if (
      mergedEmail &&
      target?.role === 'admin' &&
      patch.role &&
      patch.role !== 'admin' &&
      mergedEmail !== BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()
    ) {
      syncAuthorizedAdminEmails(authorizedAdminEmails.filter((e) => e !== mergedEmail));
    }

    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, ...patch } : c)));
    if (currentUser.id === customerId) {
      setCurrentUser((prev) => ({ ...prev, ...patch }));
    }
    showToast(
      patch.role === 'admin'
        ? `Promoted "${patch.name || target?.name || mergedEmail}" to Administrator`
        : 'User account record updated'
    );
  };

  const addCustomer = (customerData: Omit<User, 'id' | 'joinedDate'>): User => {
    const created: User = {
      ...customerData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const cleanEmail = created.email.trim().toLowerCase();
    if (created.role === 'admin' && cleanEmail && !authorizedAdminEmails.includes(cleanEmail)) {
      syncAuthorizedAdminEmails([...authorizedAdminEmails, cleanEmail]);
    }
    setCustomers((prev) => [created, ...prev]);
    showToast(
      created.role === 'admin'
        ? `Added "${created.name}" (${cleanEmail}) as an authorized Administrator`
        : `Added user "${created.name}"`
    );
    return created;
  };

  const deleteCustomer = (customerId: string) => {
    const target = customers.find((c) => c.id === customerId);
    if (target?.email) {
      const cleanEmail = target.email.trim().toLowerCase();
      if (
        cleanEmail !== BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() &&
        authorizedAdminEmails.includes(cleanEmail)
      ) {
        syncAuthorizedAdminEmails(authorizedAdminEmails.filter((e) => e !== cleanEmail));
      }
    }
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    showToast('User profile removed');
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
    showToast('Thank you. Your report has been logged for admin review.');
  };

  const updateCurrentUser = (patch: Partial<User>) => {
    const nextUser = { ...currentUser, ...patch };
    setCurrentUser(nextUser);
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentUser.id ? { ...c, ...patch } : c))
    );

    if (firebaseUser) {
      const userPath = `users/${firebaseUser.uid}`;
      setDoc(
        doc(db, 'users', firebaseUser.uid),
        sanitizeForFirestore({
          id: firebaseUser.uid,
          name: (nextUser.name || firebaseUser.displayName || 'Member').slice(0, 120),
          email: (nextUser.email || firebaseUser.email || 'user@example.com').slice(0, 254),
          phone: (nextUser.phone || '').slice(0, 40),
          role: isVerifiedAdmin ? 'admin' : currentUser.role || 'customer',
          preferredLanguage: nextUser.preferredLanguage || language,
          preferredCurrency: nextUser.preferredCurrency || currency,
          favorites: favorites.slice(0, 100),
          updatedAt: serverTimestamp()
        }),
        { merge: true }
      ).catch((error) => handleFirestoreError(error, OperationType.UPDATE, userPath));
    }

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
    showToast('Local state restored to original factory defaults.');
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
        firebaseUser,
        isAuthReady,
        isCloudConnected,
        isVerifiedAdmin,
        authorizedAdminEmails,
        addAdminByEmail,
        removeAdminByEmail,
        signInWithGoogle,
        signOutFirebase,
        logoutAdminSession,
        syncSeedCatalogToFirestore,
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
