import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  Calendar,
  CheckCheck,
  Globe,
  Heart,
  LogOut,
  MessageSquare,
  Send,
  Trash2,
  User
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Logo } from '../components/Logo';
import { PropertyCard } from '../components/PropertyCard';
import { CurrencyCode, LanguageCode } from '../types';

type CustomerTab =
  | 'overview'
  | 'favorites'
  | 'searches'
  | 'inquiries'
  | 'viewings'
  | 'notifications'
  | 'profile';

export const CustomerDashboardPage: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    currency,
    setCurrency,
    currentUser,
    updateCurrentUser,
    firebaseUser,
    isAuthReady,
    setAuthModalMode,
    logoutAdminSession,
    properties,
    favorites,
    savedSearches,
    deleteSavedSearch,
    setSearchFilters,
    inquiries,
    messages,
    sendMessage,
    viewingRequests,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useMarketplace();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<CustomerTab>('overview');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(
    inquiries[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as CustomerTab | null;
    if (
      tabParam &&
      [
        'overview',
        'favorites',
        'searches',
        'inquiries',
        'viewings',
        'notifications',
        'profile'
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (!isAuthReady) {
    return (
      <div className="min-h-[70vh] bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-md w-full text-center space-y-3 shadow-sm">
          <User className="w-10 h-10 text-[#1150EF] mx-auto animate-pulse" />
          <h1 className="font-display text-xl text-[#0D0D0D]">
            Verifying Account Session...
          </h1>
          <p className="font-body text-xs text-[#737373]">
            Loading your Buyer & Renter dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-[75vh] bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-lg w-full text-center space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#1150EF]/10 text-[#1150EF] flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-[#1150EF]/10 text-[#1150EF] font-ui text-[11px] font-bold uppercase tracking-wider">
              Buyer & Renter Account
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#0D0D0D]">
              Sign In Required
            </h1>
            <p className="font-body text-sm text-[#737373]">
              Please log in or create an account to access your saved properties, saved searches, owner messages, and scheduled property viewings.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAuthModalMode('signin')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold cursor-pointer transition-colors"
            >
              Log In to Account
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('register')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#0D0D0D] font-ui text-xs font-bold cursor-pointer transition-colors"
            >
              Create Account
            </button>
          </div>
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

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));
  const activeInquiry =
    inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0];
  const inquiryMessages = messages.filter(
    (m) => m.inquiryId === activeInquiry?.id
  );

  const navItems: { id: CustomerTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: t.dashboard.overview, icon: User },
    { id: 'favorites', label: t.dashboard.favorites, icon: Heart, count: favoriteProperties.length },
    { id: 'searches', label: t.dashboard.savedSearches, icon: Bookmark, count: savedSearches.length },
    { id: 'inquiries', label: `${t.dashboard.inquiries} & ${t.dashboard.messages}`, icon: MessageSquare, count: inquiries.length },
    { id: 'viewings', label: t.dashboard.viewingRequests, icon: Calendar, count: viewingRequests.length },
    { id: 'notifications', label: t.dashboard.notifications, icon: Bell, count: notifications.filter((n) => !n.read).length },
    { id: 'profile', label: `${t.dashboard.profile} & ${t.dashboard.languagePrefs}`, icon: Globe }
  ];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry || !replyText.trim()) return;
    sendMessage(activeInquiry.id, replyText, 'customer');
    setReplyText('');
  };

  return (
    <div className="py-8 sm:py-12 bg-neutral-50 min-h-screen">
      <div className="mdp-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Responsive Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <Logo variant="dashboard" />
              <span className="text-[11px] font-ui font-bold uppercase tracking-wider text-[#1150EF]">
                Buyer / Renter
              </span>
            </div>

            <div>
              <div className="font-display text-lg text-[#0D0D0D]">
                {currentUser.name || firebaseUser.displayName || 'Verified Member'}
              </div>
              <div className="font-ui text-xs text-[#737373] truncate">
                {firebaseUser.email || currentUser.email}
              </div>
            </div>

            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-2.5 rounded-xl font-ui text-xs font-semibold flex items-center justify-between gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#1150EF] text-white'
                        : 'text-[#161616] hover:bg-neutral-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.count !== undefined && (
                      <span
                        className={`text-[11px] font-bold tabular-nums ${
                          active ? 'text-white' : 'text-[#737373]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-neutral-100 space-y-2">
              <Link
                to="/dashboard/owner"
                className="block w-full py-2 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-center font-ui text-xs font-semibold text-[#161616]"
              >
                {t.dashboard.switchToOwnerBtn}
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logoutAdminSession();
                  navigate('/');
                }}
                className="w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-ui text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Workspace */}
          <main className="lg:col-span-9 space-y-6 min-w-0">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl text-[#0D0D0D]">
                  {t.dashboard.customerTitle}
                </h1>
                <p className="font-body text-xs sm:text-sm text-[#737373] mt-1">
                  {t.dashboard.demoNotice}
                </p>
              </div>
              <Link
                to="/buy"
                className="px-4 py-2.5 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>{t.dashboard.exploreListingsBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('favorites')}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] cursor-pointer"
                  >
                    <div className="font-ui text-xs text-[#737373]">{t.dashboard.favorites}</div>
                    <div className="font-ui text-2xl font-bold text-[#0D0D0D] tabular-nums mt-1">
                      {favoriteProperties.length}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inquiries')}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] cursor-pointer"
                  >
                    <div className="font-ui text-xs text-[#737373]">{t.dashboard.inquiries}</div>
                    <div className="font-ui text-2xl font-bold text-[#1150EF] tabular-nums mt-1">
                      {inquiries.length}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('viewings')}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] cursor-pointer"
                  >
                    <div className="font-ui text-xs text-[#737373]">
                      {t.dashboard.viewingRequests}
                    </div>
                    <div className="font-ui text-2xl font-bold text-[#0D0D0D] tabular-nums mt-1">
                      {viewingRequests.length}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('searches')}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/90 text-left hover:border-[#1150EF] cursor-pointer"
                  >
                    <div className="font-ui text-xs text-[#737373]">
                      {t.dashboard.savedSearches}
                    </div>
                    <div className="font-ui text-2xl font-bold text-[#0D0D0D] tabular-nums mt-1">
                      {savedSearches.length}
                    </div>
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                  <h2 className="font-display text-xl text-[#0D0D0D]">
                    {t.dashboard.recentInquiriesTitle}
                  </h2>
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-ui text-xs text-[#1150EF] font-bold">
                          {inq.propertyReference} · {inq.status.toUpperCase()}
                        </div>
                        <div className="font-display text-base text-[#0D0D0D]">
                          {inq.propertyTitle}
                        </div>
                        <p className="text-xs font-body text-[#737373] line-clamp-1 mt-0.5">
                          {inq.initialMessage}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInquiryId(inq.id);
                          setActiveTab('inquiries');
                        }}
                        className="px-3.5 py-2 rounded-lg bg-[#1150EF] text-white font-ui text-xs font-semibold cursor-pointer self-start sm:self-auto"
                      >
                        {t.dashboard.openThreadBtn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: FAVORITES */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-6">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.dashboard.favorites} ({favoriteProperties.length})
                </h2>
                {favoriteProperties.length === 0 ? (
                  <p className="font-body text-sm text-[#737373]">
                    {t.dashboard.noFavoritesText}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteProperties.map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED SEARCHES */}
            {activeTab === 'searches' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.dashboard.savedSearches}
                </h2>
                {savedSearches.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-display text-lg text-[#0D0D0D]">{s.name}</h3>
                      <p className="text-xs font-ui text-[#737373] mt-0.5">
                        {s.tab.toUpperCase()} · {s.category} · {s.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchFilters((prev) => ({
                            ...prev,
                            tab: s.tab,
                            location: s.location,
                            category: s.category,
                            minPrice: s.minPrice ? String(s.minPrice) : '',
                            maxPrice: s.maxPrice ? String(s.maxPrice) : '',
                            bedrooms: s.bedrooms ? String(s.bedrooms) : '',
                            guestCapacity: s.guestCapacity ? String(s.guestCapacity) : ''
                          }));
                          navigate(
                            s.tab === 'sale'
                              ? '/buy'
                              : s.tab === 'rent'
                              ? '/rent'
                              : s.tab === 'land'
                              ? '/land'
                              : '/events'
                          );
                        }}
                        className="px-3.5 py-2 rounded-lg bg-[#1150EF] text-white font-ui text-xs font-semibold cursor-pointer"
                      >
                        {t.dashboard.applySearchBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedSearch(s.id)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: INQUIRIES & MESSAGES */}
            {activeTab === 'inquiries' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl p-6 border border-neutral-200/90">
                <div className="md:col-span-5 space-y-2.5 border-b md:border-b-0 md:border-r border-neutral-100 pb-4 md:pb-0 md:pr-4">
                  <h2 className="font-display text-xl text-[#0D0D0D] mb-3">
                    {t.dashboard.inquiries}
                  </h2>
                  {inquiries.map((inq) => (
                    <button
                      key={inq.id}
                      type="button"
                      onClick={() => setSelectedInquiryId(inq.id)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-colors cursor-pointer ${
                        activeInquiry?.id === inq.id
                          ? 'bg-[#1150EF]/8 border-[#1150EF]'
                          : 'bg-neutral-50 border-neutral-200/70 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-ui">
                        <span className="font-bold text-[#1150EF]">{inq.propertyReference}</span>
                        <span className="uppercase font-semibold text-[#737373]">
                          {inq.status}
                        </span>
                      </div>
                      <div className="font-display text-sm font-semibold text-[#0D0D0D] mt-1 truncate">
                        {inq.propertyTitle}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="md:col-span-7 flex flex-col justify-between min-h-[360px]">
                  {activeInquiry ? (
                    <>
                      <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-lg text-[#0D0D0D]">
                            {activeInquiry.propertyTitle}
                          </h3>
                          <p className="text-xs font-ui text-[#737373]">
                            {t.property.reference}: {activeInquiry.propertyReference} ·{' '}
                            <strong className="uppercase">{activeInquiry.status}</strong>
                          </p>
                        </div>
                        <Link
                          to={`/property/${activeInquiry.propertyId}`}
                          className="text-xs font-ui font-semibold text-[#1150EF] hover:underline"
                        >
                          {t.sections.viewDetails} →
                        </Link>
                      </div>

                      <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-[320px]">
                        {inquiryMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3.5 rounded-xl text-xs font-body leading-relaxed ${
                              msg.senderRole === 'customer'
                                ? 'bg-[#1150EF] text-white ml-8'
                                : 'bg-neutral-100 text-[#161616] mr-8'
                            }`}
                          >
                            <div className="font-ui text-[10px] font-bold opacity-80 mb-1">
                              {msg.senderName} ({msg.senderRole.toUpperCase()})
                            </div>
                            <div>{msg.content}</div>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendReply} className="pt-3 border-t border-neutral-100 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={t.dashboard.replyPlaceholder}
                          className="flex-1 h-10 px-3.5 rounded-xl border border-neutral-200 text-xs font-body"
                        />
                        <button
                          type="submit"
                          className="h-10 px-4 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.dashboard.sendReply}</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <p className="text-sm text-[#737373]">—</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: VIEWING REQUESTS */}
            {activeTab === 'viewings' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.dashboard.viewingRequests}
                </h2>
                {viewingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-ui text-xs font-bold text-[#1150EF] uppercase">
                        {req.propertyReference} · {req.visitType.replace('_', ' ')} · {req.status}
                      </div>
                      <h3 className="font-display text-lg text-[#0D0D0D] mt-0.5">
                        {req.propertyTitle}
                      </h3>
                      <p className="font-ui text-xs text-[#161616] mt-1 tabular-nums">
                        <strong>{req.preferredDate}</strong> · <strong>{req.preferredTime}</strong>
                      </p>
                      {req.ownerResponseNote && (
                        <p className="mt-1.5 text-xs font-body text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                          {req.ownerResponseNote}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/property/${req.propertyId}`}
                      className="px-3.5 py-2 rounded-lg bg-white border border-neutral-200 hover:border-[#1150EF] font-ui text-xs font-semibold text-[#161616] self-start sm:self-auto"
                    >
                      {t.sections.viewDetails}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-[#0D0D0D]">
                    {t.dashboard.notifications}
                  </h2>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="inline-flex items-center gap-1.5 text-xs font-ui font-semibold text-[#1150EF] cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>{t.dashboard.markAllReadBtn}</span>
                  </button>
                </div>

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      n.read
                        ? 'bg-white border-neutral-200/70 opacity-75'
                        : 'bg-[#1150EF]/5 border-[#1150EF]/30'
                    }`}
                  >
                    <div className="font-ui text-xs font-bold text-[#0D0D0D]">{n.title}</div>
                    <p className="font-body text-xs text-[#737373] mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 7: PROFILE & LANGUAGE PREFERENCES */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-6">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.dashboard.profile} & {t.dashboard.languagePrefs}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.dashboard.prefInterfaceLang}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                    >
                      <option value="en">English (EN)</option>
                      <option value="fr">Français (FR)</option>
                      <option value="es">Español (ES)</option>
                      <option value="ht">Kreyòl Ayisyen (HT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.dashboard.prefDisplayCurr}
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-ui"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="DOP">Dominican Peso (RD$)</option>
                      <option value="HTG">Haitian Gourde (HTG)</option>
                    </select>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateCurrentUser({
                      name: profileName,
                      email: profileEmail,
                      phone: profilePhone,
                      bio: profileBio
                    });
                  }}
                  className="space-y-4 pt-4 border-t border-neutral-100"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                        {t.modals.fullName}
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                      />
                    </div>
                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                        {t.modals.email}
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                      />
                    </div>
                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                        {t.modals.phoneRequired}
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.dashboard.buyerProfileNotes}
                    </label>
                    <textarea
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-neutral-200 text-sm font-body"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-bold cursor-pointer"
                  >
                    {t.dashboard.saveProfileBtn}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
