import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileEdit,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Palette,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Undo2,
  UploadCloud,
  UserCheck,
  Users
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Logo } from '../components/Logo';
import { PropertyImage } from '../components/PropertyImage';
import { AdminWebsiteEditorSection } from '../components/admin/AdminWebsiteEditorSection';
import { AdminMediaLibrarySection } from '../components/admin/AdminMediaLibrarySection';
import { AdminPropertiesManagerSection } from '../components/admin/AdminPropertiesManagerSection';
import { AdminDirectoryAndCrmSection } from '../components/admin/AdminDirectoryAndCrmSection';
import { AdminCmsConfigSection } from '../components/admin/AdminCmsConfigSection';

export type AdminSidebarSectionId =
  | 'overview'
  | 'website_editor'
  | 'media_library'
  | 'properties'
  | 'pending_approvals'
  | 'featured_listings'
  | 'owners_agents'
  | 'customers'
  | 'inquiries'
  | 'viewing_requests'
  | 'translations'
  | 'navigation_footer'
  | 'branding_appearance'
  | 'reports_analytics'
  | 'website_settings';

interface SidebarItemConfig {
  id: AdminSidebarSectionId;
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeTone?: 'amber' | 'blue' | 'emerald';
}

export const AdminDashboardPage: React.FC = () => {
  const {
    properties,
    owners,
    agents,
    customers,
    inquiries,
    viewingRequests,
    mediaAssets,
    hasUnsavedDraftChanges,
    isDraftPreviewMode,
    setIsDraftPreviewMode,
    saveDraftChanges,
    publishDraftChanges,
    discardDraftChanges,
    restorePreviousVersion,
    previousPublishedSnapshot,
    lastPublishedAt,
    resetDemoData,
    reviewPropertyApproval,
    formatPrice,
    firebaseUser,
    isAuthReady,
    isVerifiedAdmin,
    setAuthModalMode,
    signInWithGoogle,
    logoutAdminSession,
    syncSeedCatalogToFirestore
  } = useMarketplace();

  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSidebarSectionId>('overview');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const handleAdminLogout = async () => {
    await logoutAdminSession();
    navigate('/');
  };

  const triggerToast = (message: string) => {
    setStatusToast(message);
    window.setTimeout(() => {
      setStatusToast((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-[70vh] bg-neutral-100/80 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShieldCheck className="w-10 h-10 text-[#1150EF] mx-auto animate-pulse" />
          <h1 className="font-display text-xl text-[#0D0D0D]">
            Verifying Administrator Session...
          </h1>
          <p className="font-body text-xs text-[#737373]">
            Checking your authenticated credentials and security permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!firebaseUser || !isVerifiedAdmin) {
    return (
      <div className="min-h-[75vh] bg-neutral-100/80 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-lg w-full text-center space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#1150EF]/10 text-[#1150EF] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          {!firebaseUser ? (
            <>
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-ui text-[11px] font-bold uppercase tracking-wider">
                  Protected Admin Area
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-[#0D0D0D]">
                  Administrator Sign-In Required
                </h1>
                <p className="font-body text-sm text-[#737373]">
                  Please sign in with an authorized administrator account to access the Website Control Center, property approvals, and user management.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('signin')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold cursor-pointer transition-colors"
                >
                  Log In with Email & Password
                </button>
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0D0D0D] hover:bg-neutral-800 text-white font-ui text-xs font-bold cursor-pointer transition-colors"
                >
                  Continue with Google
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 font-ui text-[11px] font-bold uppercase tracking-wider">
                  Access Restricted
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-[#0D0D0D]">
                  Administrator Privileges Required
                </h1>
                <p className="font-body text-sm text-[#737373]">
                  You are currently signed in as <strong className="text-[#0D0D0D]">{firebaseUser.email}</strong>, which is not registered as an administrator. Please switch to an authorized admin account or return to your dashboard.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/dashboard/customer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold transition-colors"
                >
                  Go to My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logoutAdminSession();
                    setAuthModalMode('signin');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-ui text-xs font-bold cursor-pointer transition-colors"
                >
                  Log Out & Switch Account
                </button>
              </div>
            </>
          )}
          <div className="pt-2 border-t border-neutral-100">
            <Link
              to="/"
              className="font-ui text-xs font-semibold text-[#737373] hover:text-[#1150EF]"
            >
              ← Return to Public Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingProperties = properties.filter((p) => p.approvalStatus !== 'approved');
  const approvedProperties = properties.filter((p) => p.approvalStatus === 'approved');
  const featuredProperties = properties.filter((p) => p.featured);
  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const pendingViewings = viewingRequests.filter((v) => v.status === 'pending');

  const sidebarItems: SidebarItemConfig[] = [
    {
      id: 'overview',
      number: 1,
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'website_editor',
      number: 2,
      label: 'Website Editor',
      icon: FileEdit,
      badge: hasUnsavedDraftChanges ? 'Draft' : undefined,
      badgeTone: 'amber'
    },
    {
      id: 'media_library',
      number: 3,
      label: 'Media Library',
      icon: ImageIcon,
      badge: mediaAssets.length,
      badgeTone: 'blue'
    },
    {
      id: 'properties',
      number: 4,
      label: 'Properties',
      icon: Building2,
      badge: properties.length,
      badgeTone: 'blue'
    },
    {
      id: 'pending_approvals',
      number: 5,
      label: 'Pending Approvals',
      icon: ShieldCheck,
      badge: pendingProperties.length > 0 ? pendingProperties.length : undefined,
      badgeTone: 'amber'
    },
    {
      id: 'featured_listings',
      number: 6,
      label: 'Featured Listings',
      icon: Star,
      badge: featuredProperties.length,
      badgeTone: 'emerald'
    },
    {
      id: 'owners_agents',
      number: 7,
      label: 'Owners & Agents',
      icon: UserCheck,
      badge: owners.length + agents.length
    },
    {
      id: 'customers',
      number: 8,
      label: 'Customers',
      icon: Users,
      badge: customers.length
    },
    {
      id: 'inquiries',
      number: 9,
      label: 'Inquiries & Messages',
      icon: MessageSquare,
      badge: newInquiries.length > 0 ? newInquiries.length : inquiries.length,
      badgeTone: newInquiries.length > 0 ? 'amber' : undefined
    },
    {
      id: 'viewing_requests',
      number: 10,
      label: 'Viewing Requests',
      icon: Calendar,
      badge: pendingViewings.length > 0 ? pendingViewings.length : viewingRequests.length,
      badgeTone: pendingViewings.length > 0 ? 'amber' : undefined
    },
    {
      id: 'translations',
      number: 11,
      label: 'Languages & Translations',
      icon: Globe
    },
    {
      id: 'navigation_footer',
      number: 12,
      label: 'Navigation & Footer',
      icon: Compass
    },
    {
      id: 'branding_appearance',
      number: 13,
      label: 'Branding & Appearance',
      icon: Palette
    },
    {
      id: 'reports_analytics',
      number: 14,
      label: 'Reports & Analytics',
      icon: BarChart3
    },
    {
      id: 'website_settings',
      number: 15,
      label: 'Website Settings',
      icon: Settings
    }
  ];

  const handleSaveDraft = () => {
    saveDraftChanges();
    triggerToast('Draft saved locally in browser storage.');
  };

  const handlePublish = () => {
    publishDraftChanges();
    triggerToast('Published! All changes are now live across the public website.');
  };

  const handleRestorePrevious = () => {
    restorePreviousVersion();
    triggerToast('Restored previous published version.');
  };

  const handleDiscardDraft = () => {
    discardDraftChanges();
    triggerToast('Reverted draft edits back to current published state.');
  };

  const currentSidebarItem =
    sidebarItems.find((item) => item.id === activeSection) || sidebarItems[0];

  return (
    <div className="min-h-screen bg-neutral-100/80 pb-16">
      {/* Top Admin CMS Command Bar */}
      <div className="bg-[#0D0D0D] text-white border-b border-white/10 sticky top-20 z-30">
        <div className="mdp-container py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand + Firebase / CMS State Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-emerald-400 text-[#0D0D0D] font-ui text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Admin ({firebaseUser.email})</span>
            </span>

            {hasUnsavedDraftChanges ? (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-ui text-xs font-semibold inline-flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>State: Draft (Unpublished Edits)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-ui text-xs font-semibold inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>State: Published & Synchronized</span>
              </span>
            )}

            <span className="text-[11px] font-ui text-neutral-400 hidden xl:inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last published: {new Date(lastPublishedAt).toLocaleTimeString()}</span>
            </span>
          </div>

          {/* Right: Draft / Preview / Publish / Restore / Firebase Sync Workflow Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await syncSeedCatalogToFirestore();
                triggerToast('Synchronized catalog and CMS state to Cloud Firestore.');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Seed or synchronize all current properties and CMS config to Cloud Firestore"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Sync Catalog to Firestore</span>
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Save current edits as a local draft without publishing to visitors"
            >
              <Save className="w-3.5 h-3.5 text-sky-400" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !isDraftPreviewMode;
                setIsDraftPreviewMode(next);
                triggerToast(
                  next
                    ? 'Live Draft Preview enabled! Public pages now render your Draft state.'
                    : 'Switched public pages back to Published state.'
                );
              }}
              className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                isDraftPreviewMode
                  ? 'bg-amber-400 text-[#0D0D0D] font-bold'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isDraftPreviewMode ? 'Exit Draft Preview' : 'Preview Draft on Site'}</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Publish Changes</span>
            </button>

            {hasUnsavedDraftChanges && (
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-ui text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                title="Discard unpublished draft changes"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Discard Draft</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRestorePrevious}
              disabled={!previousPublishedSnapshot}
              className={`px-3 py-2 rounded-xl font-ui text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                previousPublishedSnapshot
                  ? 'bg-white/10 hover:bg-white/15 text-white cursor-pointer'
                  : 'bg-white/5 text-neutral-500 cursor-not-allowed'
              }`}
              title={
                previousPublishedSnapshot
                  ? `Restore snapshot from ${new Date(previousPublishedSnapshot.savedAt).toLocaleTimeString()}`
                  : 'Publish at least once to store a previous version snapshot'
              }
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Previous Version</span>
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              title="Log out of Admin mode and return to the public website"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out & Exit Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {statusToast && (
        <div className="mdp-container pt-4">
          <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-700 flex items-center justify-between gap-3 text-xs font-ui font-semibold shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusToast}</span>
            </div>
            <Link
              to="/"
              className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold shrink-0"
            >
              View Public Homepage →
            </Link>
          </div>
        </div>
      )}

      {/* Main CMS Layout: Left 15-Section Sidebar + Right Workspace */}
      <div className="mdp-container pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: 15 CMS MODULES */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200/90 p-4 lg:sticky lg:top-36 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <Logo variant="dashboard" />
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1150EF] font-ui text-[10px] font-bold uppercase">
                CMS v2.5
              </span>
            </div>

            {/* Mobile horizontal / Desktop vertical nav */}
            <nav
              aria-label="Admin CMS Sidebar"
              className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0"
            >
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full shrink-0 lg:shrink px-3 py-2.5 rounded-xl font-ui text-xs font-semibold flex items-center justify-between gap-2.5 text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1150EF] text-white shadow-xs'
                        : 'text-[#161616] hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-[#1150EF]'
                        }`}
                      />
                      <span className="truncate">
                        {item.number}. {item.label}
                      </span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isActive
                            ? 'bg-white text-[#1150EF]'
                            : item.badgeTone === 'amber'
                            ? 'bg-amber-100 text-amber-900'
                            : item.badgeTone === 'emerald'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-[#737373]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <Link
                to="/"
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#0D0D0D] font-ui text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#1150EF]" />
                <span>Open Public Website</span>
              </Link>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-ui text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out & Exit Admin</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  triggerToast('All demo content, properties, and IndexedDB media reset to factory defaults.');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-ui text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Factory Reset Demo</span>
              </button>
            </div>
          </aside>

          {/* RIGHT WORKSPACE */}
          <main className="lg:col-span-9 space-y-6 min-w-0">
            {/* Active Module Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-ui font-bold uppercase tracking-wider text-[#1150EF]">
                  <span>
                    Module {currentSidebarItem.number} of 15 · MY DREAM PLACE CMS
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl text-[#0D0D0D] mt-0.5">
                  {currentSidebarItem.label}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/explore"
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-ui text-xs font-semibold"
                >
                  Explore Catalog
                </Link>
                <Link
                  to="/list-property"
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-ui text-xs font-semibold"
                >
                  + Submit Property
                </Link>
              </div>
            </div>

            {/* 1. OVERVIEW */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Demo Notice Banner */}
                <div className="bg-gradient-to-r from-[#1150EF] to-[#135AF3] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/15 font-ui text-[11px] font-bold uppercase tracking-wider">
                      Interactive Visual CMS · Demo Mode
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl">
                      Complete Website & Marketplace Control Center
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-white/85">
                      Edit homepage headlines, hero media, property listings, pending approvals,
                      multilingual translations (EN/FR/ES/HT), navigation menus, and brand colors.
                      Stage edits in <strong>Draft</strong> or click <strong>Publish Changes</strong>{' '}
                      to update the public website immediately inside your browser.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveSection('website_editor')}
                      className="px-4 py-2.5 rounded-xl bg-white text-[#1150EF] font-ui text-xs font-bold cursor-pointer"
                    >
                      Open Website Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('media_library')}
                      className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-ui text-xs font-semibold cursor-pointer"
                    >
                      Media Library ({mediaAssets.length})
                    </button>
                  </div>
                </div>

                {/* Top KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection('properties')}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-ui font-bold uppercase text-[#737373]">
                      Total Listings
                    </div>
                    <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
                      {properties.length}
                    </div>
                    <div className="text-[11px] font-ui text-emerald-700 mt-0.5">
                      {approvedProperties.length} published
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('pending_approvals')}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-ui font-bold uppercase text-amber-700">
                      Pending Queue
                    </div>
                    <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
                      {pendingProperties.length}
                    </div>
                    <div className="text-[11px] font-ui text-[#737373] mt-0.5">
                      Needs moderation
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('featured_listings')}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-ui font-bold uppercase text-[#1150EF]">
                      Featured Homes
                    </div>
                    <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
                      {featuredProperties.length}
                    </div>
                    <div className="text-[11px] font-ui text-[#737373] mt-0.5">
                      Homepage spotlight
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('media_library')}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-ui font-bold uppercase text-[#737373]">
                      Media Assets
                    </div>
                    <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
                      {mediaAssets.length}
                    </div>
                    <div className="text-[11px] font-ui text-[#737373] mt-0.5">
                      IndexedDB storage
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('inquiries')}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-ui font-bold uppercase text-[#737373]">
                      Inquiries
                    </div>
                    <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
                      {inquiries.length}
                    </div>
                    <div className="text-[11px] font-ui text-amber-700 mt-0.5">
                      {newInquiries.length} unread
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('viewing_requests')}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-ui font-bold uppercase text-[#737373]">
                      Tours & Viewings
                    </div>
                    <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
                      {viewingRequests.length}
                    </div>
                    <div className="text-[11px] font-ui text-emerald-700 mt-0.5">
                      {pendingViewings.length} pending
                    </div>
                  </button>
                </div>

                {/* Quick Pending Approvals Snapshot + Quick CMS Directory */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-display text-xl text-[#0D0D0D]">
                          Pending Listing Approvals ({pendingProperties.length})
                        </h3>
                        <p className="text-xs font-body text-[#737373]">
                          Approve or reject newly submitted properties immediately.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection('pending_approvals')}
                        className="text-xs font-ui font-bold text-[#1150EF] hover:underline cursor-pointer"
                      >
                        View All →
                      </button>
                    </div>

                    {pendingProperties.length === 0 ? (
                      <div className="p-6 rounded-xl bg-neutral-50 text-center text-xs font-ui text-[#737373]">
                        All submitted properties have been reviewed.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingProperties.slice(0, 3).map((prop) => (
                          <div
                            key={prop.id}
                            className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                                <PropertyImage
                                  src={prop.images[0]}
                                  alt={prop.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] font-ui font-bold uppercase text-amber-700">
                                  {prop.referenceCode} · {prop.approvalStatus}
                                </div>
                                <div className="font-display text-sm text-[#0D0D0D] truncate">
                                  {prop.title}
                                </div>
                                <div className="text-xs font-ui font-bold text-[#1150EF]">
                                  {formatPrice(prop.priceUSD, prop.priceUnit)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  reviewPropertyApproval(
                                    prop.id,
                                    'approved',
                                    'Approved from Admin Overview.'
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-ui text-xs font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveSection('pending_approvals')}
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-[#161616] font-ui text-xs font-semibold cursor-pointer"
                              >
                                Inspect
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Module Jump Cards */}
                  <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                    <h3 className="font-display text-xl text-[#0D0D0D]">
                      CMS Modules Directory
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {sidebarItems.slice(1).map((mod) => {
                        const ModIcon = mod.icon;
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => setActiveSection(mod.id)}
                            className="p-3 rounded-xl border border-neutral-200 hover:border-[#1150EF] hover:bg-blue-50/30 text-left flex items-center gap-2.5 transition-colors cursor-pointer"
                          >
                            <ModIcon className="w-4 h-4 text-[#1150EF] shrink-0" />
                            <div className="min-w-0">
                              <div className="font-ui text-xs font-bold text-[#0D0D0D] truncate">
                                {mod.number}. {mod.label}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WEBSITE EDITOR */}
            {activeSection === 'website_editor' && <AdminWebsiteEditorSection />}

            {/* 3. MEDIA LIBRARY */}
            {activeSection === 'media_library' && <AdminMediaLibrarySection />}

            {/* 4. PROPERTIES */}
            {activeSection === 'properties' && (
              <AdminPropertiesManagerSection mode="all" />
            )}

            {/* 5. PENDING APPROVALS */}
            {activeSection === 'pending_approvals' && (
              <AdminPropertiesManagerSection mode="pending" />
            )}

            {/* 6. FEATURED LISTINGS */}
            {activeSection === 'featured_listings' && (
              <AdminPropertiesManagerSection mode="featured" />
            )}

            {/* 7. OWNERS & AGENTS */}
            {activeSection === 'owners_agents' && (
              <AdminDirectoryAndCrmSection mode="owners" />
            )}

            {/* 8. CUSTOMERS */}
            {activeSection === 'customers' && (
              <AdminDirectoryAndCrmSection mode="customers" />
            )}

            {/* 9. INQUIRIES & MESSAGES */}
            {activeSection === 'inquiries' && (
              <AdminDirectoryAndCrmSection mode="inquiries" />
            )}

            {/* 10. VIEWING REQUESTS */}
            {activeSection === 'viewing_requests' && (
              <AdminDirectoryAndCrmSection mode="viewings" />
            )}

            {/* 11. LANGUAGES & TRANSLATIONS */}
            {activeSection === 'translations' && (
              <AdminCmsConfigSection mode="translations" />
            )}

            {/* 12. NAVIGATION & FOOTER */}
            {activeSection === 'navigation_footer' && (
              <AdminCmsConfigSection mode="navigation" />
            )}

            {/* 13. BRANDING & APPEARANCE */}
            {activeSection === 'branding_appearance' && (
              <AdminCmsConfigSection mode="branding" />
            )}

            {/* 14. REPORTS & ANALYTICS */}
            {activeSection === 'reports_analytics' && (
              <AdminCmsConfigSection mode="analytics" />
            )}

            {/* 15. WEBSITE SETTINGS */}
            {activeSection === 'website_settings' && (
              <AdminCmsConfigSection mode="settings" />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
