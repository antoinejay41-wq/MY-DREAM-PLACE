import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Edit3,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { Owner, User } from '../../types';

interface AdminDirectoryAndCrmSectionProps {
  mode: 'owners' | 'customers' | 'inquiries' | 'viewings';
}

export const AdminDirectoryAndCrmSection: React.FC<
  AdminDirectoryAndCrmSectionProps
> = ({ mode }) => {
  const {
    owners,
    agents,
    customers,
    inquiries,
    messages,
    viewingRequests,
    properties,
    updateOwner,
    addOwner,
    deleteOwner,
    updateCustomer,
    addCustomer,
    deleteCustomer,
    sendMessage,
    updateInquiryStatus,
    deleteInquiry,
    updateViewingStatus
  } = useMarketplace();

  // Owners state
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerRoleTitle, setOwnerRoleTitle] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerBio, setOwnerBio] = useState('');

  // Customers state
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custBio, setCustBio] = useState('');

  // Inquiries state
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(
    inquiries[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  const selectedInquiry =
    inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0];
  const inquiryMessages = messages.filter(
    (m) => m.inquiryId === selectedInquiry?.id
  );

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim()) return;
    if (isAddingOwner) {
      addOwner({
        name: ownerName.trim(),
        roleTitle: ownerRoleTitle.trim() || 'Verified Property Owner',
        email: ownerEmail.trim() || 'owner@mydreamplace.demo',
        phone: ownerPhone.trim() || '+1 (809) 555-0100',
        verified: true,
        responseRate: 98,
        responseTime: 'Within 1 hour',
        joinedYear: 2026,
        totalListings: 1,
        languages: ['English', 'French', 'Spanish'],
        bio: ownerBio.trim() || 'Verified estate owner on MY DREAM PLACE.'
      });
      setIsAddingOwner(false);
    } else if (editingOwner) {
      updateOwner(editingOwner.id, {
        name: ownerName.trim(),
        roleTitle: ownerRoleTitle.trim(),
        email: ownerEmail.trim(),
        phone: ownerPhone.trim(),
        bio: ownerBio.trim()
      });
      setEditingOwner(null);
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;
    if (isAddingCustomer) {
      addCustomer({
        name: custName.trim(),
        email: custEmail.trim() || 'client@example.com',
        phone: custPhone.trim() || '+1 (305) 555-0199',
        role: 'customer',
        preferredLanguage: 'en',
        preferredCurrency: 'USD',
        verified: true,
        bio: custBio.trim()
      });
      setIsAddingCustomer(false);
    } else if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: custName.trim(),
        email: custEmail.trim(),
        phone: custPhone.trim(),
        bio: custBio.trim()
      });
      setEditingCustomer(null);
    }
  };

  // MODE 7: OWNERS & AGENTS
  if (mode === 'owners') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
              Directory & Verification
            </span>
            <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
              Owners & Licensed Agents ({owners.length})
            </h2>
            <p className="font-body text-xs text-[#737373] mt-0.5">
              Edit owner credentials, toggle Verified badges, or add new estate owners and advisors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAddingOwner(true);
              setEditingOwner(null);
              setOwnerName('');
              setOwnerRoleTitle('Principal Estate Owner');
              setOwnerEmail('');
              setOwnerPhone('');
              setOwnerBio('');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Owner / Agent</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {owners.map((owner) => {
            const agentProfile = agents.find((a) => a.id === owner.id);
            const ownerPropCount = properties.filter((p) => p.ownerId === owner.id).length;
            return (
              <div
                key={owner.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl text-[#0D0D0D]">{owner.name}</h3>
                        {owner.verified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-ui font-bold text-[#1150EF]">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-ui font-semibold text-[#737373]">
                        {owner.roleTitle}
                        {agentProfile ? ` · ${agentProfile.agencyName}` : ''}
                      </p>
                    </div>
                    <span className="font-ui text-xs font-bold text-[#0D0D0D] tabular-nums">
                      {ownerPropCount} Listings
                    </span>
                  </div>

                  <p className="font-body text-xs text-[#737373] leading-relaxed">
                    {owner.bio}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 text-xs font-ui text-[#161616]">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#1150EF]" /> {owner.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#1150EF]" /> {owner.phone}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => updateOwner(owner.id, { verified: !owner.verified })}
                    className={`px-3 py-1.5 rounded-lg font-ui text-xs font-semibold cursor-pointer ${
                      owner.verified
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-neutral-100 text-[#161616]'
                    }`}
                  >
                    {owner.verified ? 'Verified Badge: ON' : 'Verify Owner'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOwner(owner);
                        setIsAddingOwner(false);
                        setOwnerName(owner.name);
                        setOwnerRoleTitle(owner.roleTitle);
                        setOwnerEmail(owner.email);
                        setOwnerPhone(owner.phone);
                        setOwnerBio(owner.bio);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOwner(owner.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(isAddingOwner || editingOwner) && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveOwner}
              className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-[#0D0D0D]">
                  {isAddingOwner ? 'Add New Owner / Agent' : 'Edit Owner / Agent Profile'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingOwner(false);
                    setEditingOwner(null);
                  }}
                  className="p-1 rounded-lg bg-neutral-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold mb-1">Role / Advisory Title</label>
                <input
                  type="text"
                  value={ownerRoleTitle}
                  onChange={(e) => setOwnerRoleTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-ui text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={ownerBio}
                  onChange={(e) => setOwnerBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingOwner(false);
                    setEditingOwner(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-xs font-ui font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1150EF] text-white text-xs font-ui font-bold cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // MODE 8: CUSTOMERS
  if (mode === 'customers') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
              Client Accounts & Preferences
            </span>
            <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
              Registered Demo Customers ({customers.length})
            </h2>
            <p className="font-body text-xs text-[#737373] mt-0.5">
              Manage buyer, renter, and event planner profiles, language/currency preferences, and verification status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAddingCustomer(true);
              setEditingCustomer(null);
              setCustName('');
              setCustEmail('');
              setCustPhone('');
              setCustBio('');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {customers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1150EF]" />
                    <h3 className="font-display text-lg text-[#0D0D0D]">{cust.name}</h3>
                  </div>
                  <span className="text-xs font-ui text-[#737373]">
                    {cust.preferredLanguage.toUpperCase()} · {cust.preferredCurrency}
                  </span>
                </div>
                <p className="text-xs font-ui text-[#161616] mt-1">
                  {cust.email} · {cust.phone}
                </p>
                {cust.bio && (
                  <p className="mt-2 font-body text-xs text-[#737373]">{cust.bio}</p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => updateCustomer(cust.id, { verified: !cust.verified })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-ui font-semibold cursor-pointer ${
                    cust.verified
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-neutral-100 text-[#161616]'
                  }`}
                >
                  {cust.verified ? 'Verified Client' : 'Unverified'}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCustomer(cust);
                      setIsAddingCustomer(false);
                      setCustName(cust.name);
                      setCustEmail(cust.email);
                      setCustPhone(cust.phone);
                      setCustBio(cust.bio || '');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCustomer(cust.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(isAddingCustomer || editingCustomer) && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveCustomer}
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-4"
            >
              <h3 className="font-display text-xl text-[#0D0D0D]">
                {isAddingCustomer ? 'Add Customer Record' : 'Edit Customer Profile'}
              </h3>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
              />
              <input
                type="text"
                placeholder="Phone"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Client notes / bio"
                value={custBio}
                onChange={(e) => setCustBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-200 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustomer(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-xs font-ui font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1150EF] text-white text-xs font-ui font-bold cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // MODE 9: INQUIRIES & MESSAGES
  if (mode === 'inquiries') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
            Marketplace Communications
          </span>
          <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
            Inquiries & Message Threads ({inquiries.length})
          </h2>
          <p className="font-body text-xs text-[#737373] mt-0.5">
            Inspect buyer/renter inquiries, send official responses, or update inquiry statuses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-4 space-y-2.5 max-h-[560px] overflow-y-auto">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiryId(inq.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  selectedInquiry?.id === inq.id
                    ? 'bg-[#1150EF]/8 border-[#1150EF]'
                    : 'bg-neutral-50/60 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-ui">
                  <span className="font-bold text-[#1150EF]">{inq.propertyReference}</span>
                  <span className="uppercase font-semibold text-[#737373]">{inq.status}</span>
                </div>
                <div className="font-display text-base text-[#0D0D0D] mt-0.5 truncate">
                  {inq.propertyTitle}
                </div>
                <div className="text-xs font-ui text-[#161616] mt-0.5">
                  From: {inq.customerName} ({inq.customerEmail})
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between min-h-[440px]">
            {selectedInquiry ? (
              <>
                <div>
                  <div className="pb-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl text-[#0D0D0D]">
                        {selectedInquiry.subject}
                      </h3>
                      <p className="text-xs font-ui text-[#737373]">
                        Client: {selectedInquiry.customerName} · {selectedInquiry.customerEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateInquiryStatus(selectedInquiry.id, 'answered')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-ui font-semibold cursor-pointer"
                      >
                        Mark Answered
                      </button>
                      <button
                        type="button"
                        onClick={() => updateInquiryStatus(selectedInquiry.id, 'closed')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 text-[#161616] text-xs font-ui font-semibold cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteInquiry(selectedInquiry.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto">
                    {inquiryMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl text-xs font-body ${
                          msg.senderRole === 'customer'
                            ? 'bg-neutral-100 text-[#161616]'
                            : 'bg-[#1150EF] text-white ml-6'
                        }`}
                      >
                        <div className="font-ui font-bold text-[11px] mb-1 opacity-85">
                          {msg.senderName} ({msg.senderRole.toUpperCase()})
                        </div>
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!replyText.trim()) return;
                    sendMessage(selectedInquiry.id, replyText, 'admin');
                    setReplyText('');
                  }}
                  className="pt-3 border-t border-neutral-200 flex gap-2"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write official concierge / owner reply..."
                    className="flex-1 h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12 text-xs text-[#737373]">
                Select an inquiry thread to view messages.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MODE 10: VIEWING REQUESTS
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
          Private Walkthroughs & Site Inspections
        </span>
        <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
          Viewing & Event Inspection Requests ({viewingRequests.length})
        </h2>
        <p className="font-body text-xs text-[#737373] mt-0.5">
          Confirm, reschedule, or decline in-person viewings, live video walkthroughs, and event venue inspections.
        </p>
      </div>

      <div className="space-y-4">
        {viewingRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-ui">
                <span className="font-bold text-[#1150EF]">{req.propertyReference}</span>
                <span>·</span>
                <span className="uppercase font-semibold text-[#161616]">
                  {req.visitType.replace('_', ' ')}
                </span>
                <span>·</span>
                <span
                  className={`font-bold uppercase ${
                    req.status === 'confirmed'
                      ? 'text-emerald-700'
                      : req.status === 'pending'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                  }`}
                >
                  Status: {req.status}
                </span>
              </div>
              <h3 className="font-display text-xl text-[#0D0D0D]">{req.propertyTitle}</h3>
              <p className="text-xs font-ui text-[#161616]">
                Client: <strong>{req.customerName}</strong> ({req.customerEmail} · {req.customerPhone})
              </p>
              <p className="text-xs font-ui text-[#737373] inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1150EF]" />
                Preferred: {req.preferredDate} at {req.preferredTime}
                {req.guestCount ? ` · Est. Guests: ${req.guestCount}` : ''}
              </p>
              {req.notes && (
                <p className="text-xs font-body text-[#737373] italic">“{req.notes}”</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  updateViewingStatus(
                    req.id,
                    'confirmed',
                    'Confirmed by Admin Concierge Desk.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-xs font-semibold cursor-pointer"
              >
                Confirm Visit
              </button>
              <button
                type="button"
                onClick={() =>
                  updateViewingStatus(
                    req.id,
                    'rescheduled',
                    'Admin requested alternative time slot.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-ui text-xs font-semibold cursor-pointer"
              >
                Reschedule
              </button>
              <button
                type="button"
                onClick={() =>
                  updateViewingStatus(req.id, 'declined', 'Declined by Admin.')
                }
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-ui text-xs font-semibold cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
