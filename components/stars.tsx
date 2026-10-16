import { Icon } from "./icons";

export function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} zvezdice`}>
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} name="star" />
      ))}
    </span>
  );
}
