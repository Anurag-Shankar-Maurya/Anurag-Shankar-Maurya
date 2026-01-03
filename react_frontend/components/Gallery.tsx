import React, { useState } from 'react';
import Lightbox from './Lightbox';
import type { Image as ApiImage } from '../types';

interface GalleryProps {
  images: ApiImage[] | { src: string; alt?: string; caption?: string }[];
  className?: string;
  columns?: number;
}

export const Gallery: React.FC<GalleryProps> = ({ images = [], className = '', columns }) => {
  const norm = (images as any[]).map((i) => ({ src: i.image_url || i.src || i, alt: i.alt_text || i.alt || '', caption: i.caption || '' }));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // If columns prop is provided, use it (inline style for flexibility).
  // Otherwise, default to responsive behavior: 1 col on mobile, 2 on tablet, 3 on desktop.
  const gridStyle = columns 
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : undefined;
    
  const gridClassName = columns 
    ? 'grid gap-4' 
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={className}>
      <div className={gridClassName} style={gridStyle}>
        {norm.map((img, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="relative overflow-hidden rounded-lg p-0 border-0 bg-transparent cursor-pointer"
            style={{ aspectRatio: '16/9' }}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-lg" />
          </button>
        ))}
      </div>

      <Lightbox images={norm} initialIndex={index} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Gallery;
