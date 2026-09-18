const STEPS = [
  {
    n: "01",
    title: "Spend like normal",
    text: "Tap Spend something in the live demo below — a real purchase happens and the leftover fraction is caught on screen.",
  },
  {
    n: "02",
    title: "Pick your round-up",
    text: "Change the round-up to €1, €2 or €5 and spend again. The maths updates instantly, every time.",
  },
  {
    n: "03",
    title: "Put it to work",
    text: "Hit Put to work, then slide invest vs. donate on the second screen — or let the default 50/50 do it for you.",
  },
  {
    n: "04",
    title: "Watch it build",
    text: "Repeat a few times and watch the curve and the impact build, with no calendar reminders and no decisions.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="section__head">
        <span className="section__eyebrow">How it works</span>
        <h2>Four small steps, on repeat</h2>
        <p>No new habit to build. FractionFlow attaches itself to the spending you&apos;re already doing.</p>
      </div>
      <div className="how">
        {STEPS.map((s) => (
          <div className="how__step" key={s.n}>
            <span className="how__num">{s.n}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
