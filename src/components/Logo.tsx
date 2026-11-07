import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../contexts/MarketplaceContext';

export type LogoVariant = 'desktop' | 'tablet' | 'mobile' | 'dashboard' | 'footer';

interface LogoProps {
  variant?: LogoVariant;
  surface?: 'light' | 'translucent' | 'dark';
  className?: string;
  to?: string;
  overrideLogoUrl?: string;
}

export const OFFICIAL_LOGO_PATH = '/assets/aistudio/My_Dream_Place_Logo_47bf8882.png';

/**
 * Reusable Official MY DREAM PLACE — Real Estate Logo Component.
 * Preserves the original uploaded logo asset while non-destructively trimming
 * excess top/bottom whitespace via a calibrated aspect-ratio container.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'desktop',
  surface = 'light',
  className = '',
  to = '/',
  overrideLogoUrl
}) => {
  const { branding } = useMarketplace();
  const [imgError, setImgError] = useState(false);

  const activeLogoUrl = overrideLogoUrl || branding?.logoUrl || OFFICIAL_LOGO_PATH;
  const isOfficialLogo = activeLogoUrl === OFFICIAL_LOGO_PATH;

  // Calibrated container dimensions matching the exact 1.54:1 bounding box of the artwork
  // (x: 3.5%–94.5%, y: 17.5%–75.5%, centered at y=46.5%) with zero clipping on any side
  const sizeConfig: Record<
    LogoVariant,
    { wrapperWidth: string; aspectHeight: string; positionClass: string }
  > = {
    desktop: {
      wrapperWidth: 'w-[132px] xl:w-[142px]',
      aspectHeight: 'h-[84px] xl:h-[90px]',
      positionClass: isOfficialLogo ? 'object-cover object-[50%_46.5%]' : 'object-contain'
    },
    tablet: {
      wrapperWidth: 'w-[120px]',
      aspectHeight: 'h-[76px]',
      positionClass: isOfficialLogo ? 'object-cover object-[50%_46.5%]' : 'object-contain'
    },
    mobile: {
      wrapperWidth: 'w-[108px]',
      aspectHeight: 'h-[68px]',
      positionClass: isOfficialLogo ? 'object-cover object-[50%_46.5%]' : 'object-contain'
    },
    dashboard: {
      wrapperWidth: 'w-[124px]',
      aspectHeight: 'h-[78px]',
      positionClass: isOfficialLogo ? 'object-cover object-[50%_46.5%]' : 'object-contain'
    },
    footer: {
      wrapperWidth: 'w-[150px]',
      aspectHeight: 'h-[96px]',
      positionClass: isOfficialLogo ? 'object-cover object-[50%_46.5%]' : 'object-contain'
    }
  };

  const current = sizeConfig[variant];

  const surfaceStyles =
    surface === 'translucent'
      ? 'bg-white shadow-sm ring-1 ring-white/50 px-2.5 py-1 rounded-xl'
      : surface === 'dark'
        ? 'bg-white px-3 py-1.5 rounded-xl shadow-sm'
        : 'bg-white px-2 py-1 rounded-lg';

  return (
    <Link
      to={to}
      aria-label={`${branding?.siteName || 'MY DREAM PLACE'} — ${branding?.subtitle || 'Real Estate'} Home`}
      className={`inline-flex items-center justify-center shrink-0 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1150EF] transition-transform duration-150 hover:scale-[1.01] ${surfaceStyles} ${className}`}
    >
      <div
        className={`relative overflow-hidden flex items-center justify-center shrink-0 ${current.wrapperWidth} ${current.aspectHeight}`}
      >
        {!imgError ? (
          <img
            src={activeLogoUrl}
            alt={`${branding?.siteName || 'MY DREAM PLACE'} — ${branding?.subtitle || 'Real Estate'}`}
            onError={() => setImgError(true)}
            className={`w-full h-full ${current.positionClass} pointer-events-none`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center leading-none text-center">
            <span className="font-display text-sm font-bold tracking-wider text-[#0D0D0D] whitespace-nowrap">
              {branding?.siteName || 'MY DREAM PLACE'}
            </span>
            <span className="font-body text-[10px] tracking-widest text-[#737373] uppercase mt-0.5">
              {branding?.subtitle || 'Real Estate'}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
