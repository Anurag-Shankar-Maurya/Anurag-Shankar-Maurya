"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MasonryGrid, Column, Text } from "@once-ui-system/core";
import Image from "next/image";
import { Lightbox } from "@/components";
import { imagesApi } from "@/lib";
import type { Image as ImageType } from "@/types";

export default function GalleryView() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const loadImages = async () => {
      // No need to check isLoading here as the effect won't re-run while it's true if it's in the dep array
      if (!hasMore) return;
      
      setIsLoading(true);
      try {
        const response = await imagesApi.list({ page });
        setImages(prevImages => [...prevImages, ...response.results]);
        setHasMore(response.next !== null);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImages();
  }, [page, hasMore]); // isLoading is not needed as it would create a loop

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = images.map((img) => ({
    src: img.data_uri || img.image_url,
    alt: img.alt_text || img.caption || "Gallery Image",
    caption: img.caption,
  }));

  return (
    <>
      <MasonryGrid columns={3} l={{ columns: 3 }} m={{ columns: 2 }} s={{ columns: 1 }} gap="16">
        {images.map((img, index) => (
          <Column key={`${img.id}-${index}`} gap="8">
            <button
              onClick={() => handleImageClick(index)}
              style={{
                lineHeight: 0,
                position: "relative",
                width: "100%",
                borderRadius: "var(--radius-m)",
                overflow: "hidden",
                cursor: "pointer",
                border: "none",
                padding: 0,
                background: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Image
                src={img.data_uri || img.image_url}
                alt={img.alt_text || img.caption || "Gallery Image"}
                width={img.width || 400}
                height={img.height || 300}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                unoptimized={!!img.data_uri}
              />
            </button>
            {img.caption && (
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {img.caption}
              </Text>
            )}
          </Column>
        ))}
      </MasonryGrid>

      {/* <div ref={loaderRef} style={{ padding: "20px 0" }}>
        {isLoading && <Text align="center">Loading more...</Text>}
        {!hasMore && images.length > 0 && (
          <Text align="center" onBackground="neutral-weak">You've reached the end of the gallery.</Text>
        )}
      </div> */}

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
