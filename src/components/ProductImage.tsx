'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/store';

interface ProductImageProps {
  product: Product;
  className?: string;
  containerClassName?: string;
  showBadges?: boolean;
}

const PNG_PRODUCT_IDS = new Set([
  'prod-1',
  'prod-5',
  'prod-7',
  'prod-9',
  'prod-10',
  'prod-11',
  'prod-12',
  'prod-13',
  'prod-15',
  'prod-23',
]);

export default function ProductImage({
  product,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 shadow-inner group',
  showBadges = true,
}: ProductImageProps) {
  // Determine if we are running in GitHub Pages environment
  const getInitialSrc = () => {
    const isGh =
      typeof window !== 'undefined'
        ? window.location.pathname.startsWith('/shrikrushna-agro-services') ||
          window.location.hostname.includes('github.io')
        : process.env.GITHUB_PAGES === 'true' || process.env.NEXT_EXPORT === 'true';

    const prefix = isGh ? '/shrikrushna-agro-services' : '';
    const ext = PNG_PRODUCT_IDS.has(product.id) ? 'png' : 'svg';
    return `${prefix}/products/${product.id}.${ext}`;
  };

  const [src, setSrc] = useState<string>(getInitialSrc);
  const [retryCount, setRetryCount] = useState<number>(0);

  const handleError = () => {
    if (retryCount === 0 && src.endsWith('.png')) {
      // First fallback: try SVG at same base path
      const base = src.startsWith('/shrikrushna-agro-services') ? '/shrikrushna-agro-services' : '';
      setSrc(`${base}/products/${product.id}.svg`);
      setRetryCount(1);
    } else if (retryCount === 1) {
      // Second fallback: try alternate base path
      if (src.startsWith('/shrikrushna-agro-services')) {
        setSrc(`/products/${product.id}.svg`);
      } else {
        setSrc(`/shrikrushna-agro-services/products/${product.id}.svg`);
      }
      setRetryCount(2);
    }
  };

  return (
    <div className={containerClassName}>
      <img
        src={src}
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
