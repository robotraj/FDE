import Butterfly from "./Butterfly";

export default function Hero() {
  return (
    <section className="hero">
      <Butterfly variant="corner" style={{ left: "8%", top: "18%" }} />
      <div className="hero__grid">
        <div>
          <span className="hero__eyebrow">🌱 Change, growing on purpose</span>
          <h1>
            Mighty portfolios grow
            <br />
            from <em>little fractions.</em>
          </h1>
          <p className="lede">
            Every purchase leaves change behind. FractionFlow catches it, invests some,
            donates some — and asks you to decide absolutely nothing.
          </p>
          <div className="hero__ctas">
            <a href="#demo" className="btn btn-primary">
              Get started — it&apos;s free
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
          <div className="hero__trust">
            <span>
              <b>€18.40</b>caught /mo, on average
            </span>
            <span>
              <b>€0.10</b>minimum to invest
            </span>
            <span>
              <b>3 taps</b>from spend to grown
            </span>
          </div>
        </div>

        <div className="hero__media">
          <div className="hero__video-frame">
            <video autoPlay muted loop playsInline poster="/videos/hero-poster.jpg">
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <span className="hero__video-caption">Your change, growing</span>
          </div>
          <Butterfly variant="hero" style={{ right: "8%", bottom: "-10px" }} />
        </div>
      </div>
    </section>
  );
}
