import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { PropertyCard } from '../components/PropertyCard';

export const AgentsPage: React.FC = () => {
  const { t, agents, publicProperties, showToast } = useMarketplace();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'own-1');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const agentListings = publicProperties.filter((p) => p.ownerId === selectedAgent?.id);

  return (
    <div className="py-12 sm:py-16 bg-neutral-50 min-h-screen">
      <div className="mdp-container space-y-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200/80">
          <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
            {t.agentsPage.kicker}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl text-[#0D0D0D] mt-1">
            {t.agentsPage.title}
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-[#737373] max-w-2xl">
            {t.agentsPage.subtitle}
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => {
            const isSelected = agent.id === selectedAgent?.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#1150EF] ring-2 ring-[#1150EF]/15 shadow-lg'
                    : 'bg-white border-neutral-200/90 hover:border-[#1150EF]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#1150EF] text-white font-display text-lg font-semibold flex items-center justify-center">
                      {agent.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    {agent.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-ui font-semibold text-emerald-700">
                        <ShieldCheck className="w-4 h-4" />
                        {t.agentsPage.verifiedBadge}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl text-[#0D0D0D]">{agent.name}</h2>
                  <p className="font-ui text-xs font-semibold text-[#1150EF] mt-0.5">
                    {agent.agencyName}
                  </p>
                  <p className="font-body text-xs text-[#737373] mt-2 line-clamp-3">
                    {agent.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1.5 text-xs font-ui text-[#161616]">
                    <div className="flex justify-between">
                      <span className="text-[#737373]">{t.agentsPage.licenseLabel}</span>
                      <span className="font-semibold tabular-nums">{agent.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#737373]">{t.property.responseRateLabel}</span>
                      <span className="font-semibold tabular-nums">{agent.responseRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#737373]">{t.property.languagesLabel}</span>
                      <span className="truncate max-w-[140px]">{agent.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2">
                  {agent.whatsapp && (
                    <a
                      href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(
                        `Hello ${agent.name}, I found your profile on MY DREAM PLACE — Real Estate and would like to inquire about your portfolio.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAgentId(agent.id);
                      showToast(`${agent.name} — ${t.agentsPage.activePortfolioKicker}`);
                    }}
                    className="py-2 px-3 rounded-lg bg-neutral-100 hover:bg-[#1150EF] hover:text-white text-[#161616] font-ui text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t.agentsPage.portfolioBtn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Portfolio Showcase */}
        {selectedAgent && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-ui text-[#1150EF] font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>
                    {t.agentsPage.activePortfolioKicker} — {selectedAgent.agencyName}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#0D0D0D] mt-1">
                  {t.agentsPage.representedBy} {selectedAgent.name} ({agentListings.length}{' '}
                  {t.agentsPage.listingsCountLabel})
                </h2>
                <p className="font-body text-xs sm:text-sm text-[#737373] mt-1">
                  {t.agentsPage.regionsServedLabel}: {selectedAgent.regionsServed.join(' · ')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-ui">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-[#161616]">
                  <Phone className="w-3.5 h-3.5 text-[#1150EF]" />
                  {selectedAgent.phone}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-[#161616]">
                  <Mail className="w-3.5 h-3.5 text-[#1150EF]" />
                  {selectedAgent.email}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-[#161616]">
                  <Globe className="w-3.5 h-3.5 text-[#1150EF]" />
                  {selectedAgent.responseTime}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentListings.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-ui text-[#737373]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t.agentsPage.verifiedFooterNote}
              </span>
              <Link
                to="/list-property"
                className="inline-flex items-center gap-1 text-[#1150EF] font-semibold hover:underline"
              >
                <span>{t.agentsPage.submitListingLink}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
