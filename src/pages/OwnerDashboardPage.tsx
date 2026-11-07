import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  MessageSquare,
  PlusCircle,
  Send,
  UserCheck,
  X
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Logo } from '../components/Logo';
import { Property } from '../types';
import { PropertyImage } from '../components/PropertyImage';

type OwnerTab =
  | 'overview'
  | 'properties'
  | 'pending'
  | 'approved'
  | 'inquiries'
  | 'viewings'
  | 'profile';

export const OwnerDashboardPage: React.FC = () => {
  const {
    t,
    properties,
    updateProperty,
    owners,
    inquiries,
    messages,
    sendMessage,
    updateInquiryStatus,
    viewingRequests,
    updateViewingStatus,
    formatPrice
  } = useMarketplace();

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<OwnerTab>('overview');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(
    inquiries[0]?.id || ''
  );
  const [ownerReply, setOwnerReply] = useState('');

  // Edit Property Modal State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as OwnerTab | null;
    if (
      tabParam &&
      ['overview', 'properties', 'pending', 'approved', 'inquiries', 'viewings', 'profile'].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const pendingList = properties.filter((p) => p.approvalStatus === 'pending');
  const approvedList = properties.filter((p) => p.approvalStatus === 'approved');
  const totalViews = properties.reduce((acc, p) => acc + p.viewsCount, 0);
  const activeInquiry =
    inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0];
  const inquiryMessages = messages.filter((m) => m.inquiryId === activeInquiry?.id);

  const openEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setEditTitle(prop.title);
    setEditPrice(prop.priceUSD);
    setEditDesc(prop.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    updateProperty(editingProperty.id, {
      title: editTitle,
      priceUSD: Number(editPrice),
      description: editDesc
    });
    setEditingProperty(null);
  };

  const handleOwnerReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry || !ownerReply.trim()) return;
    sendMessage(activeInquiry.id, ownerReply, 'owner');
    setOwnerReply('');
  };

  const navItems: { id: OwnerTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: t.dashboard.overview, icon: BarChart3 },
    { id: 'properties', label: t.dashboard.myProperties, icon: Building2, count: properties.length },
    { id: 'pending', label: t.dashboard.pendingListings, icon: Clock, count: pendingList.length },
    { id: 'approved', label: t.dashboard.approvedListings, icon: CheckCircle2, count: approvedList.length },
    { id: 'inquiries', label: `${t.dashboard.inquiries} & ${t.dashboard.messages}`, icon: MessageSquare, count: inquiries.length },
    { id: 'viewings', label: t.dashboard.viewingRequests, icon: Calendar, count: viewingRequests.length },
    { id: 'profile', label: t.dashboard.profile, icon: UserCheck }
  ];

  return (
    <div className="py-8 sm:py-12 bg-neutral-50 min-h-screen">
      <div className="mdp-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <Logo variant="dashboard" />
              <span className="text-[11px] font-ui font-bold uppercase tracking-wider text-[#1150EF]">
                {t.nav.ownerAgent}
              </span>
            </div>

            <div>
              <div className="font-display text-lg text-[#0D0D0D]">{owners[0].name}</div>
              <div className="font-ui text-xs text-[#737373]">{owners[0].roleTitle}</div>
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
                to="/list-property"
                className="w-full py-2.5 px-3 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.dashboard.addProperty}</span>
              </Link>
              <Link
                to="/dashboard/admin"
                className="block w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-center font-ui text-xs font-semibold"
              >
                {t.dashboard.openAdminQueueBtn} ({pendingList.length}) →
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6 min-w-0">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl text-[#0D0D0D]">
                  {t.dashboard.ownerTitle}
                </h1>
                <p className="font-body text-xs sm:text-sm text-[#737373] mt-1">
                  {t.dashboard.ownerSubtitle}
                </p>
              </div>
              <Link
                to="/list-property"
                className="px-4 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.dashboard.addProperty}</span>
              </Link>
            </div>

            {/* OVERVIEW & LISTING STATISTICS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-neutral-200/90">
                    <div className="font-ui text-xs text-[#737373]">
                      {t.dashboard.totalPortfolioViews}
                    </div>
                    <div className="font-ui text-2xl font-bold text-[#0D0D0D] tabular-nums mt-1">
                      {totalViews.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-neutral-200/90">
                    <div className="font-ui text-xs text-[#737373]">
                      {t.dashboard.approvedListings}
                    </div>
                    <div className="font-ui text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                      {approvedList.length}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-neutral-200/90">
                    <div className="font-ui text-xs text-[#737373]">
                      {t.dashboard.pendingListings}
                    </div>
                    <div className="font-ui text-2xl font-bold text-amber-600 tabular-nums mt-1">
                      {pendingList.length}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-neutral-200/90">
                    <div className="font-ui text-xs text-[#737373]">
                      {t.dashboard.inquiries}
                    </div>
                    <div className="font-ui text-2xl font-bold text-[#1150EF] tabular-nums mt-1">
                      {inquiries.length}
                    </div>
                  </div>
                </div>

                {/* Quick Table of Portfolio Performance */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 overflow-x-auto">
                  <h2 className="font-display text-xl text-[#0D0D0D] mb-4">
                    {t.dashboard.tablePerformanceTitle}
                  </h2>
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-neutral-200 text-[11px] font-ui uppercase text-[#737373]">
                        <th className="py-2.5 pr-4">{t.wizard.propTitleLabel}</th>
                        <th className="py-2.5 px-3">{t.wizard.step6Short}</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Views / {t.dashboard.inquiries}</th>
                        <th className="py-2.5 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs font-ui">
                      {properties.slice(0, 8).map((prop) => (
                        <tr key={prop.id}>
                          <td className="py-3 pr-4">
                            <div className="font-semibold text-[#0D0D0D]">{prop.title}</div>
                            <div className="text-[11px] text-[#737373]">
                              {prop.referenceCode} · {prop.location.city}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold tabular-nums">
                            {formatPrice(prop.priceUSD, prop.priceUnit)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`uppercase font-bold text-[11px] ${
                                prop.approvalStatus === 'approved'
                                  ? 'text-emerald-700'
                                  : prop.approvalStatus === 'pending'
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {prop.approvalStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-3 tabular-nums text-[#737373]">
                            {prop.viewsCount} · {prop.inquiriesCount}
                          </td>
                          <td className="py-3 pl-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(prop)}
                              className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-semibold cursor-pointer"
                            >
                              {t.dashboard.editBtn}
                            </button>
                            <Link
                              to={`/property/${prop.id}`}
                              className="px-2.5 py-1 rounded bg-[#1150EF]/10 text-[#1150EF] font-semibold"
                            >
                              {t.dashboard.previewBtn}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MY PROPERTIES / PENDING / APPROVED */}
            {(activeTab === 'properties' ||
              activeTab === 'pending' ||
              activeTab === 'approved') && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {activeTab === 'pending'
                    ? `${t.dashboard.pendingListings} (${pendingList.length})`
                    : activeTab === 'approved'
                    ? `${t.dashboard.approvedListings} (${approvedList.length})`
                    : `${t.dashboard.myProperties} (${properties.length})`}
                </h2>

                <div className="space-y-4">
                  {(activeTab === 'pending'
                    ? pendingList
                    : activeTab === 'approved'
                    ? approvedList
                    : properties
                  ).map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-24 h-18 rounded-lg overflow-hidden shrink-0 bg-neutral-200">
                          <PropertyImage
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-ui font-bold uppercase text-[#1150EF]">
                            {prop.referenceCode} · {prop.approvalStatus.toUpperCase()}
                          </div>
                          <h3 className="font-display text-lg text-[#0D0D0D] truncate">
                            {prop.title}
                          </h3>
                          <p className="font-ui text-xs font-bold text-[#161616] tabular-nums">
                            {formatPrice(prop.priceUSD, prop.priceUnit)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(prop)}
                          className="px-3 py-2 rounded-lg bg-white border border-neutral-200 hover:border-[#1150EF] font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{t.dashboard.editBtn}</span>
                        </button>
                        <Link
                          to={`/property/${prop.id}`}
                          className="px-3 py-2 rounded-lg bg-[#1150EF] text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.dashboard.previewBtn}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOMER INQUIRIES & OWNER MESSAGING */}
            {activeTab === 'inquiries' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl p-6 border border-neutral-200/90">
                <div className="md:col-span-5 space-y-2.5 border-b md:border-b-0 md:border-r border-neutral-100 pb-4 md:pb-0 md:pr-4">
                  <h2 className="font-display text-xl text-[#0D0D0D] mb-3">
                    {t.dashboard.inquiries} ({inquiries.length})
                  </h2>
                  {inquiries.map((inq) => (
                    <button
                      key={inq.id}
                      type="button"
                      onClick={() => setSelectedInquiryId(inq.id)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-colors cursor-pointer ${
                        activeInquiry?.id === inq.id
                          ? 'bg-[#1150EF]/8 border-[#1150EF]'
                          : 'bg-neutral-50 border-neutral-200/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-ui">
                        <span className="font-bold text-[#1150EF]">{inq.customerName}</span>
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

                <div className="md:col-span-7 flex flex-col justify-between min-h-[380px]">
                  {activeInquiry ? (
                    <>
                      <div className="pb-3 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-display text-lg text-[#0D0D0D]">
                            {activeInquiry.customerName} ({activeInquiry.customerEmail})
                          </h3>
                          <p className="text-xs font-ui text-[#737373]">
                            {activeInquiry.propertyTitle} ({activeInquiry.propertyReference})
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateInquiryStatus(activeInquiry.id, 'answered')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-ui text-xs font-semibold cursor-pointer"
                          >
                            {t.dashboard.markAnswered}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateInquiryStatus(activeInquiry.id, 'closed')}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-100 text-[#161616] font-ui text-xs font-semibold cursor-pointer"
                          >
                            {t.dashboard.markClosed}
                          </button>
                        </div>
                      </div>

                      <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-[300px]">
                        {inquiryMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3.5 rounded-xl text-xs font-body leading-relaxed ${
                              msg.senderRole === 'owner' || msg.senderRole === 'agent'
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

                      <form onSubmit={handleOwnerReply} className="pt-3 border-t border-neutral-100 flex gap-2">
                        <input
                          type="text"
                          value={ownerReply}
                          onChange={(e) => setOwnerReply(e.target.value)}
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
                  ) : null}
                </div>
              </div>
            )}

            {/* VIEWING REQUESTS MANAGEMENT */}
            {activeTab === 'viewings' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.dashboard.viewingRequests}
                </h2>
                {viewingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-ui text-xs font-bold text-[#1150EF] uppercase">
                        {req.propertyReference} · {req.visitType.replace('_', ' ')} · {req.status}
                      </div>
                      <h3 className="font-display text-lg text-[#0D0D0D] mt-0.5">
                        {req.propertyTitle}
                      </h3>
                      <p className="text-xs font-ui text-[#161616] mt-1">
                        <strong>{req.customerName}</strong> ({req.customerPhone}) —{' '}
                        <strong className="tabular-nums">{req.preferredDate}</strong> ·{' '}
                        <strong className="tabular-nums">{req.preferredTime}</strong>
                      </p>
                      {req.notes && (
                        <p className="text-xs font-body text-[#737373] mt-1">
                          “{req.notes}”
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateViewingStatus(
                            req.id,
                            'confirmed',
                            'Confirmed by owner. Gate security and concierge notified.'
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-ui text-xs font-semibold cursor-pointer"
                      >
                        {t.dashboard.confirmVisitBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateViewingStatus(
                            req.id,
                            'rescheduled',
                            'Owner proposed moving the walkthrough by 1 hour.'
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-amber-500 text-white font-ui text-xs font-semibold cursor-pointer"
                      >
                        {t.dashboard.rescheduleBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateViewingStatus(req.id, 'declined', 'Time slot unavailable.')
                        }
                        className="px-3 py-2 rounded-lg bg-neutral-200 text-[#161616] font-ui text-xs font-semibold cursor-pointer"
                      >
                        {t.dashboard.declineBtn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* OWNER PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 space-y-4">
                <h2 className="font-display text-2xl text-[#0D0D0D]">
                  {t.dashboard.profile}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {owners.map((o) => (
                    <div key={o.id} className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="font-display text-lg text-[#0D0D0D]">{o.name}</div>
                      <div className="font-ui text-xs text-[#1150EF] font-semibold">
                        {o.roleTitle}
                      </div>
                      <p className="font-body text-xs text-[#737373] mt-2">{o.bio}</p>
                      <div className="mt-3 pt-3 border-t border-neutral-200 text-xs font-ui text-[#161616]">
                        {o.phone} · {o.email}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-[#0D0D0D]">
                {t.dashboard.editBtn} ({editingProperty.referenceCode})
              </h3>
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.propTitleLabel}
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.priceUsdLabel}
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui tabular-nums"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.wizard.fullDescLabel}
                </label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#1150EF] text-white font-ui text-xs font-bold cursor-pointer"
              >
                {t.dashboard.saveChangesBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
