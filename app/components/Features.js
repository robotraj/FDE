const FEATURES = [
  {
    icon: "🌾",
    bg: "#EEF3E4",
    title: "Round up automatically",
    text: "Every purchase rounds up to €1, €2 or €5. The fraction is caught the instant you spend — no receipts, no thinking.",
  },
  {
    icon: "🌳",
    bg: "#FCEFD3",
    title: "Grow it",
    text: "Caught change is swept into an index fund. Small, frequent deposits compound quietly in the background.",
  },
  {
    icon: "🦋",
    bg: "#FBE3EA",
    title: "Give some",
    text: "Split any share toward causes you pick — clean water, books, hot meals — with a receipt every time.",
  },
  {
    icon: "🍂",
    bg: "#F0E6D2",
    title: "Stay in control",
    text: "Weekly caps, a low-balance pause, and one-tap withdraw. Reversible by design, always.",
  },
];

export default function Features() {
  return (
    <section className="section" id="impact">
      <div className="section__head">
        <span className="section__eyebrow">Why it works</span>
        <h2>A habit you never have to keep</h2>
        <p>FractionFlow runs quietly behind every purchase, so the system carries the discipline instead of you.</p>
      </div>
      <div className="features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-card__icon" style={{ background: f.bg }}>
              {f.icon}
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
