import React, { useState } from 'react';
import Lightbox from './Lightbox';
import type { Image as ApiImage } from '../types';

interface GalleryProps {
  images: ApiImage[] | { src: string; alt?: string; caption?: string }[];
  className?: string;
  columns?: number;
}

export const Gallery: React.FC<GalleryProps> = ({ images = [], className = '', columns = 3 }) => {
  const norm = (images as any[]).map((i) => ({ src: i.data_uri || i.image_url || i.src || i, alt: i.alt_text || i.alt || '', caption: i.caption || '' }));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className={className}>
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
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
