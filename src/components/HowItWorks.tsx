import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ArrowsLeftRight,
  ClipboardText,
  Compass,
  Faders,
  FileZip,
  SealCheck,
  type Icon,
} from "@phosphor-icons/react";
import { EASE, SectionHeading } from "./ui";

type Step = { icon: Icon; title: string; desc: string };

const STEPS: Step[] = [
  {
    icon: FileZip,
    title: "Install",
    desc: "Download the ZIP, extract it, and copy the aws-advisor folder to your skills folder.",
  },
  {
    icon: Faders,
    title: "Set context, optionally",
    desc: "Answer a few questions about your stack. Or skip and add context later.",
  },
  {
    icon: Compass,
    title: "Explain the goal",
    desc: "Say your goal in plain words, with limits and priorities.",
  },
  {
    icon: ArrowsLeftRight,
    title: "Compare options",
    desc: "Review a short list with trade-offs and links you can open.",
  },
  {
    icon: ClipboardText,
    title: "Review a bounded plan",
    desc: "See what would run, in what order, and where it stops. Before it runs.",
  },
  {
    icon: SealCheck,
    title: "Verify & approve",
    desc: "Check the dry run, then approve. Big actions need your okay.",
  },
];

export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = STEPS.length;
    const idx = Math.floor((v - 0.12) / 0.76 * n);
    setActive(Math.max(0, Math.min(n - 1, idx)));
  });

  const pad = String(active + 1).padStart(2, "0");

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={
            <span id="how-title">
              Six steps. <em className="text-pale-iris">Your</em> context.
            </span>
          }
          sub="From download to a checked plan. Same clear steps each time."
        />

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Sticky presentation panel (decorative; real content lives in the list) */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28" aria-hidden="true">
              <div className="relative h-[320px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -26 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <span className="block select-none font-serif text-[11rem] leading-[0.82] text-white/[0.07]">
                      {pad}
                    </span>
                    <span className="mt-6 block font-serif text-[32px] leading-tight text-cloud">
                      {STEPS[active].title}
                    </span>
                    <span className="mt-3 block font-sans text-[11px] uppercase tracking-[0.24em] text-fog">
                      Step {pad} / 06
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-10 flex gap-1.5">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= active ? "bg-pure" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* The steps */}
          <ol ref={listRef} aria-label="How AWS Advisor works" className="space-y-3 md:space-y-4">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <motion.li
                  key={s.title}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.8, delay: 0.05 * i, ease: EASE }}
                  className={`min-h-[150px] rounded-2xl border p-6 transition-colors duration-300 md:p-7 lg:min-h-[200px] ${
                    isActive ? "border-white/12 bg-graphite" : "border-white/5 bg-graphite/45"
                  }`}
                >
                  <div className="flex h-full items-start gap-5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isActive ? "bg-pure text-obsidian" : "bg-white/6 text-cloud"
                      }`}
                    >
                      <s.icon size={19} weight={isActive ? "bold" : "regular"} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-fog">
                        Step {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-serif text-[21px] leading-tight text-cloud md:text-[23px]">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 max-w-[54ch] text-[14px] leading-relaxed text-ash">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
