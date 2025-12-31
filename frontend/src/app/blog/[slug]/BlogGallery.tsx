"use client";

import { useState } from "react";
import { Column, Text } from "@once-ui-system/core";
import Image from "next/image";
import { Lightbox } from "@/components";
import type { Image as ImageType } from "@/types";

interface BlogGalleryProps {
  images: ImageType[];
  postTitle: string;
}

export function BlogGallery({ images, postTitle }: BlogGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = images.map((img) => ({
    src: img.data_uri || img.image_url,
    alt: img.alt_text || img.caption || postTitle,
    caption: img.caption,
  }));

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {images.map((img, index) => (
          <Column key={img.id} gap="8">
            <button
              onClick={() => handleImageClick(index)}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
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
                alt={img.alt_text || img.caption || postTitle}
                fill
                style={{ objectFit: "cover" }}
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
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
