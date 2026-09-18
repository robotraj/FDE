export default function Butterfly({ variant = "hero", style }) {
  return (
    <div className={`butterfly butterfly--${variant}`} style={style}>
      <div className="butterfly__wing butterfly__wing--left" />
      <div className="butterfly__body" />
      <div className="butterfly__wing butterfly__wing--right" />
    </div>
  );
}
