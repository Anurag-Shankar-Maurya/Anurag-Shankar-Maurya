"use client";

import { useEffect, useState, useCallback } from "react";
import { Flex, Button, Icon } from "@once-ui-system/core";
import Image from "next/image";
import styles from "./Lightbox.module.scss";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, goToNext, goToPrevious, onClose]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <Icon name="close" size="l" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.navButtonPrev}`}
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <Icon name="chevronLeft" size="l" />
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonNext}`}
              onClick={goToNext}
              aria-label="Next image"
            >
              <Icon name="chevronRight" size="l" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className={styles.imageContainer}>
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            style={{ objectFit: "contain" }}
            unoptimized={currentImage.src.startsWith("data:")}
          />
        </div>

        {/* Image Caption and Counter */}
        <div className={styles.imageInfo}>
          {currentImage.caption && (
            <div className={styles.caption}>{currentImage.caption}</div>
          )}
          {images.length > 1 && (
            <div className={styles.counter}>
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${
                  index === currentIndex ? styles.thumbnailActive : ""
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized={img.src.startsWith("data:")}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
