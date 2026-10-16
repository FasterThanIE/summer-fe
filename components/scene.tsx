export function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <video className="scene__photo scene__photo--day" src="/bg.mp4" poster="/poster.jpg" autoPlay muted loop playsInline preload="auto" />
      <video className="scene__photo scene__photo--night" src="/bg-night.mp4" poster="/poster-night.jpg" muted loop playsInline preload="metadata" />
      <div className="scene__fog" />
      <div className="scene__mist" />
    </div>
  );
}
