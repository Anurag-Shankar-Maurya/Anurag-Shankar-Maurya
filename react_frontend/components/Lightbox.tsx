import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Image } from '../types';

interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [index, setIndex] = React.useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, images]);

  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
  }, [isOpen, images.length, onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [isOpen, keyHandler]);

  useEffect(() => {
    // prevent background scrolling
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  if (!isOpen || images.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-[95%] max-h-[95%] w-full flex items-center justify-center p-4">
        <button className="absolute top-4 right-4 z-40 p-2 rounded-md bg-black/40 text-white" onClick={onClose} aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {images.length > 1 && (
          <button className="absolute left-4 z-40 p-2 rounded-md bg-black/40 text-white" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="relative max-w-full max-h-full rounded shadow-lg bg-black/60 p-2 flex items-center justify-center">
          <img
            src={images[index].src}
            alt={images[index].alt || ''}
            className="max-w-full max-h-[80vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {images[index].caption && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-center text-sm text-gray-200 px-4 py-2 bg-black/40 rounded">
            {images[index].caption}
          </div>
        )}

        {images.length > 1 && (
          <button className="absolute right-4 z-40 p-2 rounded-md bg-black/40 text-white" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;
