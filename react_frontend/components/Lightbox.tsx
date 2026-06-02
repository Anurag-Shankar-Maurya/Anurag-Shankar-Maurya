import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, ArrowRight, ZoomIn, Play, Pause } from 'lucide-react';
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
  const cycleZoom = () => {
    setZoom((z) => {
      const next = z === 1 ? 2 : z === 2 ? 3 : 1;
      if (next === 1) {
        setTranslate({ x: 0, y: 0 });
      }
      return next;
    });
  };
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
      <div className="absolute inset-0 bg-[#f9f9f9]/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative max-w-[95%] h-[95vh] w-full flex flex-col items-center justify-center pb-40 p-4">
        
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
            className={`relative max-w-full max-h-[62vh] rounded-[2rem] border border-[#E5E5E5] bg-white p-4 flex items-center justify-center shadow-none ${zoom > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
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
              className="max-w-full max-h-[62vh] object-contain rounded-[1.5rem] transition-transform duration-0"
              style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})` }}
              onClick={(e) => e.stopPropagation()}
              onLoad={handleImageLoad}
              draggable={false}
            />
          </div>
        </div>

        {images[index].caption && (
          <div className="fixed bottom-48 left-1/2 -translate-x-1/2 z-60 text-center text-sm font-semibold text-black px-6 py-2.5 bg-white border border-[#E5E5E5] rounded-full max-w-[90%] shadow-none">
            {images[index].caption}
          </div>
        )}

        {/* Thumbnails strip (Queue) */}
        {images.length > 1 && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-60 w-full flex items-center justify-center pointer-events-auto">
            <div className="flex gap-3 overflow-x-auto px-4 py-2 max-w-[90%] bg-white/40 backdrop-blur-sm border border-[#E5E5E5]/60 rounded-[1.5rem] scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); setZoom(1); }}
                  className={`relative rounded-[1rem] overflow-hidden border-2 transform transition-all duration-200 shrink-0 ${i === index ? 'border-black scale-105' : 'border-[#E5E5E5] hover:border-black'} focus:outline-none`}
                  style={{ width: 72, height: 50 }}
                  aria-label={`Preview ${i + 1}`}
                >
                  <img src={img.src} alt={img.alt || ''} className="w-full h-full object-cover transition-transform duration-150 rounded-[0.85rem] hover:scale-110" />

                  {i === index && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
                      <div
                        className="h-1 bg-black"
                        style={{ width: `${Math.round(100 * Math.max(0, Math.min(1, progress))) }%`, transition: isPlaying ? 'width 0.05s linear' : 'none' }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unified Minimalist Bottom Capsule Control */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-60 flex items-center gap-6 px-6 py-3 bg-white border border-[#E5E5E5] rounded-full shadow-lg pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-black transition-colors"
            aria-label="Close"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); goPrev(); }} 
                className="text-black hover:text-black/60 transition-colors p-1"
                aria-label="Previous"
                title="Previous"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); goNext(); }} 
                className="text-black hover:text-black/60 transition-colors p-1"
                aria-label="Next"
                title="Next"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          <button 
            onClick={(e) => { e.stopPropagation(); cycleZoom(); }} 
            className={`transition-colors p-1 ${zoom > 1 ? 'text-black font-semibold' : 'text-black hover:text-black/60'}`}
            aria-label="Cycle Zoom"
            title={`Zoom: ${zoom}x`}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
            className={`transition-colors p-1 ${isPlaying ? 'text-black' : 'text-black hover:text-black/60'}`}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default Lightbox;
