import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { UserRole } from '../types';
import { Logo } from './Logo';

export const AuthDemoModal: React.FC = () => {
  const {
    t,
    authModalMode,
    setAuthModalMode,
    currentUser,
    updateCurrentUser,
    activeRole,
    setActiveRole
  } = useMarketplace();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [selectedRole, setSelectedRole] = useState<UserRole>(activeRole);

  if (!authModalMode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      role: selectedRole
    });
    setActiveRole(selectedRole);
    setAuthModalMode(null);

    if (selectedRole === 'owner' || selectedRole === 'agent') {
      navigate('/dashboard/owner');
    } else if (selectedRole === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/customer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={authModalMode === 'signin' ? t.nav.signIn : t.nav.register}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <Logo variant="mobile" />
          <button
            type="button"
            onClick={() => setAuthModalMode(null)}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h2 className="font-display text-2xl text-[#0D0D0D]">
              {authModalMode === 'signin' ? t.nav.signIn : t.nav.register}
            </h2>
            <p className="mt-1 font-body text-xs text-[#737373]">
              {t.modals.authDemoSubtitle}
            </p>
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
              {t.modals.activeDemoRoleLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'owner', 'admin'] as UserRole[]).map((r) => {
                const roleLabel =
                  r === 'customer'
                    ? t.nav.buyerRenter
                    : r === 'owner'
                      ? t.nav.ownerAgent
                      : t.nav.adminQueue;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-xl font-ui text-xs font-semibold border cursor-pointer transition-colors ${
                      selectedRole === r
                        ? 'bg-[#1150EF] text-white border-[#1150EF]'
                        : 'bg-neutral-50 text-[#161616] border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {roleLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
              {t.modals.fullName}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs font-body text-[#737373]">
            <ShieldCheck className="w-4 h-4 text-[#1150EF] shrink-0 mt-0.5" />
            <span>{t.modals.localSessionNotice}</span>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-sm font-semibold cursor-pointer transition-colors"
          >
            {t.modals.continueAsRoleBtn}{' '}
            {selectedRole === 'customer'
              ? t.nav.buyerRenter
              : selectedRole === 'owner'
                ? t.nav.ownerAgent
                : t.nav.adminQueue}
          </button>
        </form>
      </div>
    </div>
  );
};
