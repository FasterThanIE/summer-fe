import Image from "next/image";
import { Icon } from "../icons";

type GalleryProps = {
  images: string[];
  name: string;
};

export function Gallery({ images, name }: GalleryProps) {
  return (
    <div className="gallery">
      {images.map((src, i) => (
        <button key={src} type="button" aria-label={`Otvori fotografiju ${i + 1} od ${images.length}`}>
          <Image
            src={src}
            alt={`${name}, fotografija ${i + 1}`}
            fill
            sizes={i === 0 ? "(max-width: 1000px) 100vw, 430px" : "(max-width: 640px) 100vw, 220px"}
            preload={i === 0}
          />
        </button>
      ))}
      <button className="gallery__all" type="button">
        <Icon name="grid" />
        Sve fotografije ({images.length})
      </button>
    </div>
  );
}
