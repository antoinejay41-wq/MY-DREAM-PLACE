import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Globe,
  Heart,
  Layers,
  LogOut,
  Menu,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import { Logo } from './Logo';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { CurrencyCode, LanguageCode, UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    currency,
    setCurrency,
    activeRole,
    setActiveRole,
    firebaseUser,
    logoutAdminSession,
    favorites,
    compareIds,
    setIsCompareOpen,
    notifications,
    approvalQueue,
    setAuthModalMode,
    navigationConfig,
    websiteContent,
    branding,
    isDraftPreviewMode,
    setIsDraftPreviewMode,
    publishDraftChanges
  } = useMarketplace();

  const location = useLocation();
  const navigate = useNavigate();
  const isHomeHero = location.pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  const headerRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Content-aware ResizeObserver to support 125% & 150% browser zoom and longer translated labels
  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setLangMenuOpen(false);
    setRoleMenuOpen(false);
  }, [location.pathname, location.search]);

  // Close menus on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setMoreMenuOpen(false);
        setLangMenuOpen(false);
        setRoleMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setMoreMenuOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const pendingApprovalsCount = approvalQueue.filter((a) => a.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Content-aware threshold: if language has longer words (fr/es/ht) or container width is < 1320px, use compact desktop mode
  const hasLongLabels = language === 'fr' || language === 'es' || language === 'ht';
  const isFullDesktopNav = containerWidth >= (hasLongLabels ? 1360 : 1240);
  const isMediumDesktopNav = containerWidth >= 980 && !isFullDesktopNav;

  const resolveNavLabel = (labelKey: string, customLabel?: string) => {
    if (customLabel && customLabel.trim()) return customLabel.trim();
    const navDict = t.nav as unknown as Record<string, string>;
    return navDict[labelKey] || labelKey;
  };

  const visibleHeaderItems = navigationConfig.headerItems
    .filter((item) => item.visible || item.essential)
    .map((item) => ({
      to: item.to,
      label: resolveNavLabel(item.labelKey, item.customLabel),
      group: item.group
    }));

  const primaryNavLinks = visibleHeaderItems.slice(0, 3);
  const secondaryNavLinks = visibleHeaderItems.slice(3);
  const allNavLinks = visibleHeaderItems;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const languages: { code: LanguageCode; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'ht', label: 'Kreyòl Ayisyen', short: 'HT' }
  ];

  const currencies: CurrencyCode[] = ['USD', 'DOP', 'HTG'];

  const handleRoleSelect = (role: UserRole, path: string) => {
    setActiveRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      style={
        isHomeHero && branding.primaryColor
          ? { backgroundColor: `${branding.primaryColor}f2` }
          : undefined
      }
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isHomeHero
          ? 'bg-[#1150EF]/95 backdrop-blur-md border-b border-white/15 text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-neutral-200/80 text-[#161616]'
      }`}
    >
      {/* Live CMS Draft Preview Mode Banner */}
      {isDraftPreviewMode && (
        <div className="bg-amber-400 text-[#0D0D0D] px-4 py-2 text-xs font-ui font-bold flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0D0D0D] text-amber-300 uppercase tracking-wider text-[10px]">
              Draft Preview Mode
            </span>
            <span>
              You are previewing unpublished CMS draft changes across the live website.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={publishDraftChanges}
              className="px-3 py-1 rounded-lg bg-[#0D0D0D] text-white hover:bg-neutral-800 cursor-pointer"
            >
              Publish Now
            </button>
            <button
              type="button"
              onClick={() => setIsDraftPreviewMode(false)}
              className="px-3 py-1 rounded-lg bg-black/15 hover:bg-black/25 cursor-pointer"
            >
              Exit Preview
            </button>
            <Link
              to="/admin"
              className="px-3 py-1 rounded-lg bg-white text-[#0D0D0D] hover:bg-neutral-100"
            >
              Back to /admin
            </Link>
          </div>
        </div>
      )}

      {/* Optional Announcement Banner controlled by CMS */}
      {websiteContent.showAnnouncementBanner && websiteContent.announcementBanner && (
        <div className="bg-[#0D0D0D] text-white/90 px-4 py-1.5 text-center text-xs font-ui">
          {websiteContent.announcementBanner}
        </div>
      )}

      <div
        ref={headerRef}
        className="mdp-container min-h-[84px] py-2 flex items-center justify-between gap-[clamp(12px,1.5vw,24px)]"
      >
        {/* ZONE 1: LEFT — Official MY DREAM PLACE Logo */}
        <div className="flex items-center shrink-0">
          <div className="hidden lg:block">
            <Logo variant="desktop" surface={isHomeHero ? 'translucent' : 'light'} />
          </div>
          <div className="hidden md:block lg:hidden">
            <Logo variant="tablet" surface={isHomeHero ? 'translucent' : 'light'} />
          </div>
          <div className="block md:hidden">
            <Logo variant="mobile" surface={isHomeHero ? 'translucent' : 'light'} />
          </div>
        </div>

        {/* ZONE 2: CENTER — Content-Aware Responsive Navigation */}
        {isFullDesktopNav && (
          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center justify-center gap-1 2xl:gap-1.5 min-w-0 flex-1"
          >
            {allNavLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg font-body text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isHomeHero
                      ? active
                        ? 'bg-white text-[#1150EF] font-semibold shadow-xs'
                        : 'text-white/90 hover:text-white hover:bg-white/12'
                      : active
                      ? 'bg-[#1150EF] text-white font-semibold'
                      : 'text-[#161616] hover:text-[#1150EF] hover:bg-[#1150EF]/6'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {isMediumDesktopNav && (
          <nav
            aria-label="Compact Desktop Navigation"
            className="hidden lg:flex items-center justify-center gap-1 min-w-0 flex-1"
          >
            {primaryNavLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg font-body text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isHomeHero
                      ? active
                        ? 'bg-white text-[#1150EF] font-semibold'
                        : 'text-white/90 hover:text-white hover:bg-white/12'
                      : active
                      ? 'bg-[#1150EF] text-white font-semibold'
                      : 'text-[#161616] hover:text-[#1150EF] hover:bg-[#1150EF]/6'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Properties / More Dropdown for Medium Desktop or Long Labels */}
            <div ref={moreDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                aria-expanded={moreMenuOpen}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-body text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isHomeHero
                    ? 'text-white/90 hover:text-white hover:bg-white/12'
                    : 'text-[#161616] hover:text-[#1150EF] hover:bg-[#1150EF]/6'
                }`}
              >
                <span>{t.nav.propertiesDropdown}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    moreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-60 rounded-xl bg-white text-[#161616] shadow-xl border border-neutral-200/90 py-2 z-50">
                  {secondaryNavLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm font-body transition-colors ${
                        isActive(item.to)
                          ? 'bg-[#1150EF]/8 text-[#1150EF] font-semibold'
                          : 'text-[#161616] hover:bg-neutral-100'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* ZONE 3: RIGHT — Language Selector, Dashboards, and Authentication Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Compare Counter Button (when active) */}
          {compareIds.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              title={t.nav.compare}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-ui text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isHomeHero
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-[#1150EF]/10 text-[#1150EF] hover:bg-[#1150EF]/15'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="tabular-nums">{compareIds.length}/3</span>
            </button>
          )}

          {/* Favorites Shortcut */}
          <Link
            to="/dashboard/customer?tab=favorites"
            title={t.nav.favorites}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-ui text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              isHomeHero
                ? 'text-white/90 hover:text-white hover:bg-white/12'
                : 'text-[#161616] hover:text-[#1150EF] hover:bg-neutral-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-current' : ''}`} />
            <span className="tabular-nums">{favorites.length}</span>
          </Link>

          {/* Language & Currency Selector (Visible on Desktop, Tablet, and Mobile) */}
          <div ref={langDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-expanded={langMenuOpen}
              aria-label="Select Language and Currency"
              className={`min-h-[42px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-ui text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
                isHomeHero
                  ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                  : 'border-neutral-200 bg-neutral-50 text-[#161616] hover:border-[#1150EF]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>{language.toUpperCase()}</span>
              <span className="hidden sm:inline opacity-60">·</span>
              <span className="hidden sm:inline">{currency}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white text-[#161616] shadow-xl border border-neutral-200/90 p-3 z-50">
                <div className="text-[11px] font-ui font-bold uppercase tracking-wider text-[#737373] mb-2">
                  Language / Langue / Idioma / Lang
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`px-2.5 py-2 rounded-lg text-left text-xs font-ui font-medium transition-colors cursor-pointer ${
                        language === l.code
                          ? 'bg-[#1150EF] text-white font-semibold'
                          : 'bg-neutral-50 text-[#161616] hover:bg-neutral-100'
                      }`}
                    >
                      <div className="font-bold">{l.short}</div>
                      <div className="text-[11px] opacity-85 truncate">{l.label}</div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-neutral-100 pt-2.5">
                  <div className="text-[11px] font-ui font-bold uppercase tracking-wider text-[#737373] mb-1.5">
                    {t.nav.currencyLabel}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => {
                          setCurrency(curr);
                          setLangMenuOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-ui font-semibold text-center cursor-pointer transition-colors ${
                          currency === curr
                            ? 'bg-[#161616] text-white'
                            : 'bg-neutral-100 text-[#161616] hover:bg-neutral-200'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dashboards & Role Switcher Dropdown (Desktop) */}
          <div ref={roleDropdownRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setRoleMenuOpen((prev) => !prev)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-ui text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
                isHomeHero
                  ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                  : 'border-neutral-200 bg-white text-[#161616] hover:border-[#1150EF]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="capitalize">{activeRole}</span>
              {(unreadNotificationsCount > 0 || pendingApprovalsCount > 0) && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-md bg-amber-400 text-[#0D0D0D] font-bold tabular-nums">
                  {activeRole === 'admin' ? pendingApprovalsCount : unreadNotificationsCount}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white text-[#161616] shadow-xl border border-neutral-200/90 p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-ui font-bold uppercase tracking-wider text-[#737373]">
                  {t.nav.dashboardsLabel}
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('customer', '/dashboard/customer')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-ui font-medium text-left cursor-pointer transition-colors ${
                    location.pathname.startsWith('/dashboard/customer')
                      ? 'bg-[#1150EF]/10 text-[#1150EF] font-semibold'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <span>{t.nav.customerDashboard}</span>
                  <span className="text-[11px] text-[#737373]">{t.nav.buyerRenter}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('owner', '/dashboard/owner')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-ui font-medium text-left cursor-pointer transition-colors ${
                    location.pathname.startsWith('/dashboard/owner')
                      ? 'bg-[#1150EF]/10 text-[#1150EF] font-semibold'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <span>{t.nav.ownerDashboard}</span>
                  <span className="text-[11px] text-[#737373]">{t.nav.ownerAgent}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin', '/admin')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-ui font-medium text-left cursor-pointer transition-colors ${
                    location.pathname.startsWith('/admin') ||
                    location.pathname.startsWith('/dashboard/admin')
                      ? 'bg-[#1150EF]/10 text-[#1150EF] font-semibold'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1150EF]" />
                    {t.nav.adminQueue} (/admin)
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] tabular-nums">
                    {pendingApprovalsCount} {t.nav.pendingShort}
                  </span>
                </button>

                {(activeRole === 'admin' || firebaseUser) && (
                  <div className="mt-1.5 pt-1.5 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={async () => {
                        setRoleMenuOpen(false);
                        await logoutAdminSession();
                        navigate('/');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-ui font-bold text-rose-600 hover:bg-rose-50 text-left cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out of Admin / Sign Out
                      </span>
                      <span className="text-[10px] uppercase tracking-wider">Exit</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Auth Actions: Register or Log Out when in Admin */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {(activeRole === 'admin' || firebaseUser) && (
              <button
                type="button"
                onClick={async () => {
                  await logoutAdminSession();
                  navigate('/');
                }}
                title="Log out of Admin session and return to public website"
                className={`min-h-[40px] px-3.5 py-2 ${branding.buttonRadius || 'rounded-lg'} font-ui text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                  isHomeHero
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setAuthModalMode('register')}
              className={`min-h-[40px] px-4 py-2 ${branding.buttonRadius || 'rounded-lg'} font-ui text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all shadow-xs ${
                isHomeHero
                  ? 'bg-white text-[#1150EF] hover:bg-neutral-100'
                  : 'bg-[#1150EF] text-white hover:bg-[#135AF3]'
              }`}
            >
              {t.nav.register}
            </button>
          </div>

          {/* Tablet & Mobile Hamburger Button (>= 44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`lg:hidden min-w-[44px] min-h-[44px] rounded-xl inline-flex items-center justify-center cursor-pointer transition-colors ${
              isHomeHero
                ? 'bg-white/15 text-white hover:bg-white/25'
                : 'bg-neutral-100 text-[#161616] hover:bg-neutral-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Complete Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[80px] z-50 bg-black/50 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="w-full max-h-[calc(100dvh-80px)] overflow-y-auto bg-white text-[#161616] border-b border-neutral-200 shadow-2xl px-5 py-6"
          >
            {/* Primary & Secondary Destinations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-6">
              {allNavLinks.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[46px] px-4 py-3 rounded-xl font-body text-sm font-medium flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-[#1150EF] text-white font-semibold'
                        : 'bg-neutral-50 text-[#161616] hover:bg-neutral-100'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Interactive Dashboards & Role Switcher */}
            <div className="border-t border-neutral-200 pt-5 mb-6">
              <p className="text-xs font-ui font-bold uppercase tracking-wider text-[#737373] mb-3">
                {t.nav.dashboardsLabel}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('customer', '/dashboard/customer')}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-left font-ui text-xs font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>{t.nav.customerDashboard}</span>
                  <Bell className="w-3.5 h-3.5 text-[#1150EF]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('owner', '/dashboard/owner')}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-left font-ui text-xs font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>{t.nav.ownerDashboard}</span>
                  <UserCheck className="w-3.5 h-3.5 text-[#1150EF]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin', '/admin')}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-left font-ui text-xs font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>{t.nav.adminQueue} (/admin)</span>
                  <span className="font-bold tabular-nums">{pendingApprovalsCount}</span>
                </button>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="border-t border-neutral-200 pt-5 flex flex-col sm:flex-row gap-2.5">
              {(activeRole === 'admin' || firebaseUser) && (
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logoutAdminSession();
                    navigate('/');
                  }}
                  className="min-h-[46px] flex-1 px-4 py-3 rounded-xl bg-rose-600 text-white font-ui text-sm font-semibold hover:bg-rose-700 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out & Exit Admin</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalMode('register');
                }}
                className="min-h-[46px] flex-1 px-4 py-3 rounded-xl bg-[#1150EF] text-white font-ui text-sm font-semibold hover:bg-[#135AF3] cursor-pointer"
              >
                {t.nav.register}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
