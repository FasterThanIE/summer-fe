"use client";

import { useState } from "react";

const NO_PHOTO = "/img/no-photo.svg";

type AccommodationPhotoProps = {
  src: string | null;
  alt: string;
  isEager?: boolean;
  isFill?: boolean;
};

export function AccommodationPhoto({ src, alt, isEager = false, isFill = true }: AccommodationPhotoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const shownSrc = src === null || src === failedSrc ? NO_PHOTO : src;

  function detectFailureBeforeHydration(image: HTMLImageElement | null) {
    if (image?.complete && image.naturalWidth === 0 && shownSrc !== NO_PHOTO) {
      setFailedSrc(src);
    }
  }

  return (
    <img
      ref={detectFailureBeforeHydration}
      className={isFill ? "photo-fill" : undefined}
      src={shownSrc}
      alt={alt}
      loading={isEager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );
}
