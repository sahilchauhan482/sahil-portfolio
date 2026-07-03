'use client';

import { useState } from 'react';
import { site } from '@/lib/data';

// Shows your real photo. If /public/profile.jpg is missing, it gracefully
// falls back to the placeholder graphic instead of a broken image.
// SVGs use a plain <img> (Next's optimizer rejects them); raster images too,
// with onError fallback — simplest robust path for a swap-in photo.
export default function ProfilePhoto() {
  const [src, setSrc] = useState(site.photo);
  const alt = `${site.name}, ${site.role}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setSrc('/profile.svg')}
      className="h-full w-full object-cover"
    />
  );
}
