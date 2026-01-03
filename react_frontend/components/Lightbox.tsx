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
  const [zoom, setZoom] = React.useState(1);
  const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1 for autoplay progress
  const rafRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);
  const AUTOPLAY_MS = 3000; // slideshow duration per slide (ms)


  // refs and helpers for pan/zoom calculations
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const startPanRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastTranslateRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchPinchRef = React.useRef<{ dist: number; zoom: number } | null>(null);

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const getContainerRect = () => containerRef.current?.getBoundingClientRect();
  const getImageNatural = () => ({
    w: imgRef.current?.naturalWidth || 0,
    h: imgRef.current?.naturalHeight || 0,
  });

  const computeMaxTranslate = () => {
    const rect = getContainerRect();
    const natural = getImageNatural();
    if (!rect || !natural.w || !natural.h) return { x: 0, y: 0 };
    // image fit scale
    const fitScale = Math.min(rect.width / natural.w, rect.height / natural.h);
    const dispW = natural.w * fitScale * zoom;
    const dispH = natural.h * fitScale * zoom;
    const maxX = Math.max(0, (dispW - rect.width) / 2);
    const maxY = Math.max(0, (dispH - rect.height) / 2);
    return { x: maxX, y: maxY };
  };

  const clampTranslateX = (x: number) => {
    const max = computeMaxTranslate().x;
    return clamp(x, -max, max);
  };
  const clampTranslateY = (y: number) => {
    const max = computeMaxTranslate().y;
    return clamp(y, -max, max);
  };


  useEffect(() => {
    setIndex(initialIndex);
    setZoom(1);
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

  // Reset translate when index or images change
  useEffect(() => {
    setTranslate({ x: 0, y: 0 });
    lastTranslateRef.current = { x: 0, y: 0 };
    setZoom(1);
  }, [index, images]);


  // Autoplay handling using requestAnimationFrame so we can show progress
  useEffect(() => {
    let cancelled = false;

    const tick = (now: number) => {
      if (!isPlaying || cancelled) return;
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const frac = elapsed / AUTOPLAY_MS;
      if (frac >= 1) {
        // advance slide and reset timer
        setIndex((i) => (i + 1) % images.length);
        startTimeRef.current = now;
        setProgress(0);
      } else {
        setProgress(frac);
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };

    if (isPlaying) {
      // start loop
      startTimeRef.current = performance.now();
      setProgress(0);
      rafRef.current = window.requestAnimationFrame(tick);
    } else {
      // when paused, cancel RAF
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    return () => {
      cancelled = true;
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, images.length]);

  // If user manually changes slide while playing, reset timer/progress
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      setProgress(0);
    } else {
      // when paused, leave progress as-is; ensure RAF is stopped
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }, [index, isPlaying]);

  const goPrev = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
  };
  const goNext = () => {
    setIndex((i) => (i + 1) % images.length);
    setZoom(1);
  };

  const zoomIn = () => setZoom((z) => clamp(+(z + 0.25).toFixed(2), 1, 3));
  const zoomOut = () => setZoom((z) => clamp(+(z - 0.25).toFixed(2), 1, 3));
  const togglePlay = () => setIsPlaying((p) => !p);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    startPanRef.current = { x: e.clientX, y: e.clientY };
    lastTranslateRef.current = { ...translate };
    setIsPanning(true);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !startPanRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startPanRef.current.x;
    const dy = e.clientY - startPanRef.current.y;
    const newX = clampTranslateX(lastTranslateRef.current.x + dx);
    const newY = clampTranslateY(lastTranslateRef.current.y + dy);
    setTranslate({ x: newX, y: newY });
  };
  const handleMouseUp = (e?: React.MouseEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    startPanRef.current = null;
    lastTranslateRef.current = { ...translate };
  };

  // Touch handlers (pan + pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (zoom <= 1) return;
      const t = e.touches[0];
      startPanRef.current = { x: t.clientX, y: t.clientY };
      lastTranslateRef.current = { ...translate };
      setIsPanning(true);
    } else if (e.touches.length === 2) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      touchPinchRef.current = { dist, zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning && startPanRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - startPanRef.current.x;
      const dy = t.clientY - startPanRef.current.y;
      const newX = clampTranslateX(lastTranslateRef.current.x + dx);
      const newY = clampTranslateY(lastTranslateRef.current.y + dy);
      setTranslate({ x: newX, y: newY });
    } else if (e.touches.length === 2 && touchPinchRef.current) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const scale = dist / touchPinchRef.current.dist;
      setZoom((prev) => {
        const newZ = clamp(touchPinchRef.current!.zoom * scale, 1, 3);
        return newZ;
      });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    startPanRef.current = null;
    touchPinchRef.current = null;
    lastTranslateRef.current = { ...translate };
  };

  // Image load handler to ensure we clamp translate after natural size known
  const handleImageLoad = () => {
    setTranslate((t) => ({ x: clampTranslateX(t.x), y: clampTranslateY(t.y) }));
  }

  if (!isOpen || images.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-[95%] max-h-[95%] w-full flex flex-col items-center justify-center p-4">
        <button className="fixed top-4 right-4 z-60 p-2 rounded-md bg-gray-700/60 text-white" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {images.length > 1 && (
          <button className="fixed left-6 top-1/2 -translate-y-1/2 z-60 p-3 rounded-full bg-gray-700/60 text-white" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          className="relative flex items-center justify-center w-full"
          onWheel={(e) => {
            // Wheel to zoom (prevent page scrolling while over lightbox)
            e.preventDefault();
            const delta = -e.deltaY;
            const step = delta > 0 ? 0.12 : -0.12;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            // cursor offset from center
            const offsetX = e.clientX - rect.left - rect.width / 2;
            const offsetY = e.clientY - rect.top - rect.height / 2;
            setZoom((prevZoom) => {
              const newZoom = clamp(prevZoom + step, 1, 3);
              if (newZoom === 1) {
                setTranslate({ x: 0, y: 0 });
                return newZoom;
              }
              // adjust translate so zoom focuses on cursor
              setTranslate((t) => {
                const scaleChange = newZoom / prevZoom;
                const newX = clampTranslateX(t.x - offsetX * (scaleChange - 1));
                const newY = clampTranslateY(t.y - offsetY * (scaleChange - 1));
                return { x: newX, y: newY };
              });
              return newZoom;
            });
          }}
        >
          <div
            ref={containerRef}
            className={`relative max-w-full max-h-[70vh] rounded shadow-lg p-2 flex items-center justify-center ${zoom > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={(e) => { e.stopPropagation(); if (zoom > 1) { setZoom(1); setTranslate({ x: 0, y: 0 }); } else { setZoom(2); } }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imgRef}
              src={images[index].src}
              alt={images[index].alt || ''}
              className="max-w-full max-h-[70vh] object-contain rounded transition-transform duration-0"
              style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})` }}
              onClick={(e) => e.stopPropagation()}
              onLoad={handleImageLoad}
              draggable={false}
            />
          </div>

          {/* Controls (zoom, play/pause) */}
          <div className="fixed right-6 top-20 z-60 flex flex-col gap-2">
            <button
              className="p-2 rounded-md bg-gray-700/60 text-white"
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              aria-label="Zoom in"
              title="Zoom in"
            >
              +
            </button>
            <button
              className="p-2 rounded-md bg-gray-700/60 text-white"
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              aria-label="Zoom out"
              title="Zoom out"
            >
              −
            </button>
            <button
              className={`p-2 rounded-md bg-gray-700/60 text-white ${isPlaying ? 'ring-2 ring-white' : ''}`}
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        {images[index].caption && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-60 text-center text-sm text-gray-200 px-4 py-2 bg-black/40 rounded max-w-[90%]">
            {images[index].caption}
          </div>
        )}

        {images.length > 1 && (
          <button className="fixed right-6 top-1/2 -translate-y-1/2 z-60 p-3 rounded-full bg-gray-700/60 text-white" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-full flex items-center justify-center pointer-events-auto">
            <div className="flex gap-2 overflow-x-auto px-2 py-1 max-w-[90%]">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); setZoom(1); }}
                  className={`relative rounded-md overflow-hidden border-2 transform transition ${i === index ? 'border-white scale-105' : 'border-transparent'} focus:outline-none`}
                  style={{ width: 80, height: 56 }}
                  aria-label={`Preview ${i + 1}`}
                >
                  <img src={img.src} alt={img.alt || ''} className="w-full h-full object-cover transition-transform duration-150 hover:scale-110" />

                  {i === index && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
                      <div
                        className="h-1 bg-white"
                        style={{ width: `${Math.round(100 * Math.max(0, Math.min(1, progress))) }%`, transition: isPlaying ? 'width 0.05s linear' : 'none' }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;
