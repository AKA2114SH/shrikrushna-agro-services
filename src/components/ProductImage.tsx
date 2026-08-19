'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/store';

interface ProductImageProps {
  product: Product;
  className?: string;
  containerClassName?: string;
  showBadges?: boolean;
}

export default function ProductImage({
  product,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 shadow-inner group',
  showBadges = true,
}: ProductImageProps) {
  // Determine base asset prefix dynamically based on browser location or environment
  const getAssetBase = () => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/shrikrushna-agro-services')) {
        return '/shrikrushna-agro-services';
      }
    }
    return '';
  };

  const assetBase = getAssetBase();
  const [currentSrc, setCurrentSrc] = useState<string>(`${assetBase}/products/${product.id}.png`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (currentSrc.endsWith('.png')) {
      // Fallback to SVG
      setCurrentSrc(`${assetBase}/products/${product.id}.svg`);
    } else if (!currentSrc.startsWith('/shrikrushna-agro-services') && !hasError) {
      // Try with /shrikrushna-agro-services prefix
      setCurrentSrc(`/shrikrushna-agro-services/products/${product.id}.png`);
    } else if (!hasError) {
      setHasError(true);
      setCurrentSrc(`${assetBase}/products/${product.id}.svg`);
    }
  };

  return (
    <div className={containerClassName}>
      <img
        src={currentSrc}
        alt={`${product.nameMr} (${product.nameEn}) - श्री कृष्ण ॲग्रो सर्व्हिसेस सिन्नर`}
        loading="lazy"
        className={`${className} group-hover:scale-105 transition-transform duration-300`}
        onError={handleError}
      />
      {showBadges && (
        <>
          <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-white/20 shadow-sm pointer-events-none">
            {product.brandName}
          </div>
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm pointer-events-none">
            {product.packSize}
          </div>
        </>
      )}
    </div>
  );
}
