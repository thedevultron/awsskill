import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Benefits from "./components/Benefits";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Automation from "./components/Automation";
import Privacy from "./components/Privacy";
import Contents from "./components/Contents";
import Install from "./components/Install";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal"
      style={{ scaleX }}
    />
  );
}

export default function App() {
  return (
    <div id="top" className="relative min-h-screen bg-obsidian">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-pure focus:px-5 focus:py-2.5 focus:text-[14px] focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero />
        <TrustStrip />
        <Benefits />
        <Features />
        <HowItWorks />
        <Automation />
        <Privacy />
        <Contents />
        <Install />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />

      {/* Film grain */}
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
