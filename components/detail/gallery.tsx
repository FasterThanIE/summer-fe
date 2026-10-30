"use client";

import { useState } from "react";
import { AccommodationPhoto } from "../accommodation-photo";
import { Icon } from "../icons";
import { Lightbox } from "./lightbox";

type GalleryProps = {
  images: string[];
  name: string;
};

export function Gallery({ images, name }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isFew = images.length < 5;

  if (images.length === 0) {
    return (
      <div className="gallery gallery--few" style={{ gridTemplateColumns: "1fr" }}>
        <AccommodationPhoto src={null} alt={name} />
      </div>
    );
  }

  return (
    <>
      <div className={`gallery${isFew ? " gallery--few" : ""}`} style={isFew ? { gridTemplateColumns: `repeat(${images.length}, 1fr)` } : undefined}>
        {images.slice(0, 5).map((src, i) => (
          <button key={src} type="button" aria-label={`Otvori fotografiju ${i + 1} od ${images.length}`} onClick={() => setOpenIndex(i)}>
            <AccommodationPhoto src={src} alt={`${name}, fotografija ${i + 1}`} isEager={i === 0} />
          </button>
        ))}
        {images.length > 1 && (
          <button className="gallery__all" type="button" onClick={() => setOpenIndex(0)}>
            <Icon name="grid" />
            Sve fotografije ({images.length})
          </button>
        )}
      </div>
      {openIndex !== null && (
        <Lightbox images={images} name={name} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
