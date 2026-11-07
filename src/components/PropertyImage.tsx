import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
  categoryLabel?: string;
}

export const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  alt,
  className = '',
  categoryLabel
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#1150EF] via-[#3c7af6] to-[#76A2FA] text-white p-6 text-center select-none ${className}`}
      >
        <Building2 className="w-10 h-10 text-white/80 mb-2 stroke-[1.5]" />
        <p className="font-display text-sm tracking-wide uppercase line-clamp-2 max-w-[240px]">
          {alt}
        </p>
        {categoryLabel && (
          <span className="mt-1 font-ui text-[11px] text-white/75">{categoryLabel}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
