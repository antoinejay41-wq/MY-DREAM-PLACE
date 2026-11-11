import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone, RotateCcw, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { useMarketplace } from '../contexts/MarketplaceContext';

export const Footer: React.FC = () => {
  const { t, language, websiteContent, branding, navigationConfig, resetDemoData } =
    useMarketplace();

  const visibleFooterLinks = navigationConfig.footerLinks.filter((l) => l.visible);
  const visibleSocialLinks = navigationConfig.socialLinks.filter((s) => s.visible);

  return (
    <footer className="bg-[#0D0D0D] text-white border-t border-white/10 pt-16 pb-24 md:pb-14">
      <div className="mdp-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="footer" surface="dark" />
            <p className="font-display text-xl text-white/95 italic max-w-sm">
              “{branding.slogan || `${t.hero.tagline1} ${t.hero.tagline2}`}”
            </p>
            <p className="font-body text-sm text-white/65 leading-relaxed max-w-md">
              {language === 'en' && websiteContent.footerDescription
                ? websiteContent.footerDescription
                : t.dashboard.demoNotice}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-ui text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#76A2FA]" />
                {branding.footerBrandNote || t.property.noOnlineCheckoutNotice}
              </span>
            </div>

            {visibleSocialLinks.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {visibleSocialLinks.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-[#1150EF] text-xs font-ui font-semibold text-white/85 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{soc.platform}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace Destinations */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-[#76A2FA]">
              {t.footer.collectionsTitle}
            </h3>
            <ul className="space-y-2.5 font-body text-sm text-white/80">
              {visibleFooterLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className={
                      item.to === '/list-property'
                        ? 'inline-flex items-center gap-1 text-[#76A2FA] hover:text-white font-medium transition-colors'
                        : 'hover:text-white transition-colors'
                    }
                  >
                    <span>{item.label}</span>
                    {item.to === '/list-property' && <ArrowUpRight className="w-3.5 h-3.5" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Portals */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-[#76A2FA]">
              {t.footer.portalsTitle}
            </h3>
            <ul className="space-y-2.5 font-body text-sm text-white/80">
              <li>
                <Link to="/dashboard/customer" className="hover:text-white transition-colors">
                  {t.nav.customerDashboard}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/owner" className="hover:text-white transition-colors">
                  {t.nav.ownerDashboard}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors font-semibold text-[#76A2FA]">
                  Admin CMS (/admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Admin Services */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-[#76A2FA]">
              {t.footer.advisoryTitle}
            </h3>
            <div className="space-y-2.5 font-body text-xs sm:text-sm text-white/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#76A2FA] shrink-0 mt-0.5" />
                <span>{websiteContent.officeAddress}</span>
              </p>

              {/* USA Call Number */}
              <div className="pt-1 space-y-1">
                <span className="block font-ui text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Call From USA
                </span>
                <a
                  href={`tel:${(websiteContent.supportPhone || '+14842082963').replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-2 text-white hover:text-[#76A2FA] font-ui font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#76A2FA] shrink-0" />
                  <span>{websiteContent.supportPhone || '+1 (484) 208-2963'}</span>
                </a>
              </div>

              {/* WhatsApp Direct Numbers */}
              <div className="pt-1 space-y-1.5">
                <span className="block font-ui text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  WhatsApp Direct (Admin & Services)
                </span>
                {(
                  websiteContent.whatsappNumbers && websiteContent.whatsappNumbers.length > 0
                    ? websiteContent.whatsappNumbers
                    : ['+1 (829) 850-8107', '+1 (829) 876-8096', '+509 3999-4934']
                ).map((waDisplay) => {
                  const digitsOnly = waDisplay.replace(/\D/g, '');
                  const waDigits =
                    digitsOnly.length === 10 &&
                    (digitsOnly.startsWith('809') ||
                      digitsOnly.startsWith('829') ||
                      digitsOnly.startsWith('849'))
                      ? `1${digitsOnly}`
                      : digitsOnly;
                  return (
                    <a
                      key={waDisplay}
                      href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                        'Hello MY DREAM PLACE Admin, I would like to inquire about your real estate services.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-ui text-xs font-semibold transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>WhatsApp: {waDisplay}</span>
                    </a>
                  );
                })}
              </div>

              {/* Admin Service Emails */}
              <div className="pt-1 space-y-1.5">
                <span className="block font-ui text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Email Admin for Services
                </span>
                <a
                  href={`mailto:${websiteContent.supportEmail || 'jnscompany916@gmail.com'}`}
                  className="flex items-center gap-2 text-white/90 hover:text-[#76A2FA] font-ui text-xs font-medium break-all transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#76A2FA] shrink-0" />
                  <span>{websiteContent.supportEmail || 'jnscompany916@gmail.com'}</span>
                </a>
                {(websiteContent.secondarySupportEmail || 'contact.mc99haiti@gmail.com') && (
                  <a
                    href={`mailto:${websiteContent.secondarySupportEmail || 'contact.mc99haiti@gmail.com'}`}
                    className="flex items-center gap-2 text-white/90 hover:text-[#76A2FA] font-ui text-xs font-medium break-all transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#76A2FA] shrink-0" />
                    <span>{websiteContent.secondarySupportEmail || 'contact.mc99haiti@gmail.com'}</span>
                  </a>
                )}
              </div>
            </div>
            <p className="pt-2 text-[11px] font-ui text-white/50">{t.common.currencyNote}</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-ui text-white/55">
          <p>
            © {new Date().getFullYear()} {branding.siteName} — {branding.subtitle}.{' '}
            {language === 'en' && websiteContent.footerCopyrightText
              ? websiteContent.footerCopyrightText
              : t.footer.rightsReserved}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span>EN · FR · ES · HT</span>
            <span>·</span>
            <span>USD · DOP · HTG</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
