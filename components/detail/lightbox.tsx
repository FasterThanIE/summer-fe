"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { AccommodationPhoto } from "../accommodation-photo";
import { Icon } from "../icons";

type LightboxProps = {
  images: string[];
  name: string;
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
};

export function Lightbox({ images, name, index, onChange, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const hasSeveral = images.length > 1;

  useEffect(() => {
    if (!dialog.current?.open) {
      dialog.current?.showModal();
    }
  }, []);

  function showPrevious() {
    onChange((index - 1 + images.length) % images.length);
  }

  function showNext() {
    onChange((index + 1) % images.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }
  }

  return (
    <dialog ref={dialog} className="lb" aria-label="Galerija fotografija" onClose={onClose} onKeyDown={handleKeyDown}>
      <div className="lb__inner">
        <div className="lb__top">
          <span>
            {index + 1} / {images.length}
          </span>
          <button className="lb__close" type="button" aria-label="Zatvori galeriju" onClick={() => dialog.current?.close()}>
            &times;
          </button>
        </div>
        <div className="lb__img">
          <AccommodationPhoto src={images[index]} alt={`${name}, fotografija ${index + 1}`} isEager isFill={false} />
        </div>
        <div className="lb__thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" aria-label={`Fotografija ${i + 1}`} aria-current={i === index} onClick={() => onChange(i)}>
              <AccommodationPhoto src={src} alt="" />
            </button>
          ))}
        </div>
        {hasSeveral && (
          <>
            <button className="lb__nav lb__prev" type="button" aria-label="Prethodna fotografija" onClick={showPrevious}>
              <Icon name="chevronLeft" />
            </button>
            <button className="lb__nav lb__next" type="button" aria-label="Sledeća fotografija" onClick={showNext}>
              <Icon name="chevronRight" />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
