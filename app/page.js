import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Demo from "./components/Demo";
import Testimonial from "./components/Testimonial";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />

      <section className="section" id="demo">
        <div className="section__head">
          <span className="section__eyebrow">Live prototype</span>
          <h2>Try it yourself</h2>
          <p>Both screens below are fully interactive — tap through and watch the numbers move.</p>
        </div>
        <div className="demo-section">
          <Demo />
        </div>
      </section>

      <Testimonial />
      <CTA />
      <Footer />
    </>
  );
}
