import Image from "next/image";
import { Icon } from "../icons";

type LightboxProps = {
  images: string[];
  name: string;
  index?: number;
  open?: boolean;
};

export function Lightbox({ images, name, index = 0, open = false }: LightboxProps) {
  return (
    <dialog className="lb" aria-label="Galerija fotografija" open={open}>
      <div className="lb__inner">
        <div className="lb__top">
          <span>
            {index + 1} / {images.length}
          </span>
          <button className="lb__close" type="button" aria-label="Zatvori galeriju">
            &times;
          </button>
        </div>
        <div className="lb__img">
          <Image src={images[index]} alt={`${name}, fotografija ${index + 1}`} width={800} height={600} sizes="100vw" />
        </div>
        <div className="lb__thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" aria-label={`Fotografija ${i + 1}`} aria-current={i === index}>
              <Image src={src} alt="" fill sizes="72px" />
            </button>
          ))}
        </div>
        <button className="lb__nav lb__prev" type="button" aria-label="Prethodna fotografija">
          <Icon name="chevronLeft" />
        </button>
        <button className="lb__nav lb__next" type="button" aria-label="Sledeca fotografija">
          <Icon name="chevronRight" />
        </button>
      </div>
    </dialog>
  );
}
