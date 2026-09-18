import Butterfly from "./Butterfly";

export default function Testimonial() {
  return (
    <section className="section">
      <div className="testimonial">
        <Butterfly variant="corner" style={{ left: "-40px", top: "-30px" }} />
        <blockquote>
          &ldquo;I never felt like I could afford to invest. Turns out I already had
          €18 a month — it was just hiding in the change.&rdquo;
        </blockquote>
        <cite>— An early FractionFlow tester</cite>
      </div>
    </section>
  );
}
