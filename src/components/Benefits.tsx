import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Faders, ListChecks, Scales } from "@phosphor-icons/react";
import { Reveal } from "./ui";

/* ------------------------------------------------------------------ */
/* Word-by-word scroll reveal: the editorial centerpiece */
/* ------------------------------------------------------------------ */
type W = { t: string; em?: boolean };

const STATEMENT: W[] = [
  { t: "The" },
  { t: "right" },
  { t: "AWS" },
  { t: "answer" },
  { t: "depends" },
  { t: "on" },
  { t: "your" },
  { t: "architecture," },
  { t: "your" },
  { t: "region," },
  { t: "and" },
  { t: "your" },
  { t: "priorities." },
  { t: "So" },
  { t: "AWS" },
  { t: "Advisor" },
  { t: "asks", em: true },
  { t: "first,", em: true },
  { t: "then", em: true },
  { t: "advises.", em: true },
];

function Word({
  word,
  progress,
  range,
}: {
  word: W;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.26em] inline-block ${word.em ? "text-pale-iris" : ""}`}
    >
      {word.t}
    </motion.span>
  );
}

function WordReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  return (
    <p
      ref={ref}
      className="mx-auto max-w-4xl text-balance text-center font-serif text-[clamp(1.85rem,4.6vw,3.4rem)] leading-[1.16] tracking-[-0.01em] text-cloud"
    >
      {STATEMENT.map((w, i) =>
        reduce ? (
          <span key={i} className={`mr-[0.26em] inline-block ${w.em ? "text-pale-iris" : ""}`}>
            {w.t}
          </span>
        ) : (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / STATEMENT.length, (i + 1) / STATEMENT.length]} />
        )
      )}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits strip                                                      */
/* ------------------------------------------------------------------ */
const BENEFITS = [
  {
    icon: Faders,
    title: "Context-aware advice",
    desc: "Advice that fits your stack and goals. Not a generic list.",
  },
  {
    icon: Scales,
    title: "Explicit trade-offs",
    desc: "See gains, risks, and costs for each option before you choose.",
  },
  {
    icon: ListChecks,
    title: "Verifiable steps",
    desc: "Steps come with links and scripts you can read, run, and check.",
  },
];

export default function Benefits() {
  return (
    <section aria-label="Benefits" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <WordReveal />

        <div className="mt-20 grid gap-3 md:mt-28 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1} className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-white/5 bg-graphite p-7 transition-colors duration-200 hover:border-white/10 hover:bg-steel md:p-8">
                <div className="flex items-center justify-between">
                  <b.icon
                    size={26}
                    weight="light"
                    aria-hidden="true"
                    className="text-cloud transition-colors duration-200 group-hover:text-pure"
                  />
                  <span className="font-sans text-[11px] tracking-[0.16em] text-fog">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-[22px] leading-tight text-cloud">{b.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ash">{b.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
