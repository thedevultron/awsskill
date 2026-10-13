import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  ArrowsClockwise,
  CheckCircle,
  ClipboardText,
  Clock,
  Flask,
  Info,
  Lightning,
  MagnifyingGlass,
  Path,
  SealCheck,
  StopCircle,
  Warning,
  type Icon,
} from "@phosphor-icons/react";
import { EASE, Reveal, SectionHeading } from "./ui";

/* ------------------------------------------------------------------ */
/* The bounded run loop                                                */
/* ------------------------------------------------------------------ */
type LoopStep = { icon: Icon; label: string; desc: string };

const LOOP: LoopStep[] = [
  { icon: ClipboardText, label: "Plan", desc: "List the smallest steps to reach the goal." },
  { icon: Flask, label: "Dry run", desc: "Rehearse the steps. Touch nothing real." },
  { icon: SealCheck, label: "Approve", desc: "You say yes before big actions happen." },
  { icon: Lightning, label: "Act once", desc: "Run the approved steps once. No silent retries." },
  { icon: MagnifyingGlass, label: "Verify", desc: "Check results match what you expected." },
  { icon: StopCircle, label: "Stop and log", desc: "Halt and record results. The loop always ends." },
];

/* Node positions on a 100×100 grid, clockwise from the top */
const POS: [number, number][] = [
  [50, 10],
  [84.6, 30],
  [84.6, 70],
  [50, 90],
  [15.4, 70],
  [15.4, 30],
];

const LIMITS: { icon: Icon; title: string; desc: string }[] = [
  {
    icon: ClipboardText,
    title: "Plan-only by default",
    desc: "The skill drafts and explains. It does not deploy.",
  },
  {
    icon: Clock,
    title: "No self-scheduling",
    desc: "Repeats need a real scheduler you set up. The skill never sets one.",
  },
  {
    icon: Path,
    title: "Bounded scope",
    desc: "Each run states stop rules and max steps before it starts.",
  },
  {
    icon: Warning,
    title: "Fail loudly",
    desc: "Errors stop the loop and show context. No silent retries.",
  },
  {
    icon: CheckCircle,
    title: "Explicit approval",
    desc: "Big actions need your yes. Every time.",
  },
];

/* ------------------------------------------------------------------ */
/* Loop diagram: ring draws with scroll, nodes light as it passes     */
/* ------------------------------------------------------------------ */
function LoopDiagram({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const pathLength = useSpring(progress, { stiffness: 55, damping: 18 });
  const [lit, setLit] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    setLit(Math.max(0, Math.min(LOOP.length, Math.ceil(v * LOOP.length - 0.001))));
  });

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
      className="relative aspect-square"
      style={{ width: "min(440px, 88vw, 72svh)" }}
      role="img"
      aria-label="The bounded run loop: plan, dry run, approve, act once, verify, then stop and log."
    >
      {/* ambient glow */}
      <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(0,179,221,0.08),transparent_65%)]" />

      {/* ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.6" />
        <g transform="rotate(-90 50 50)">
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#00b3dd"
            strokeWidth="0.9"
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : pathLength }}
          />
        </g>
      </svg>

      {/* center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[24%] text-center">
        <StopCircle size={22} weight="light" className="text-signal" aria-hidden="true" />
        <p className="mt-3.5 font-serif text-[clamp(1.25rem,3.4vw,1.7rem)] leading-tight text-cloud">
          Every run ends.
        </p>
        <p className="mt-2.5 font-sans text-[9px] uppercase tracking-[0.26em] text-fog">
          The bounded run loop
        </p>
      </div>

      {/* nodes */}
      {LOOP.map((n, i) => {
        const [x, y] = POS[i];
        const isLit = reduce ? true : i < lit;
        const below = y < 55;
        return (
          <div
            key={n.label}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${
                isLit
                  ? "border-pure bg-pure text-obsidian shadow-[0_0_28px_rgba(255,255,255,0.14)]"
                  : "border-white/12 bg-graphite text-cloud"
              }`}
            >
              <n.icon size={17} weight={isLit ? "bold" : "regular"} aria-hidden="true" />
            </div>
            <span
              className={`absolute left-1/2 hidden min-[480px]:block -translate-x-1/2 break-words text-center font-sans text-[8px] uppercase tracking-[0.18em] transition-colors duration-500 sm:text-[9.5px] ${
                below ? "top-full mt-2" : "bottom-full mb-2"
              } ${isLit ? "text-cloud" : "text-fog"}`}
            >
              {n.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Automation() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="automation" aria-labelledby="auto-title" className="relative bg-abyss py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          eyebrow="Automation safety"
          title={
            <span id="auto-title">
              Automation that knows <em className="text-pale-iris">where to stop</em>.
            </span>
          }
          sub="Design runs with clear limits. Each run has one shape. It always ends."
        />

        {/* Sticky scroll scene */}
        <div ref={sceneRef} className="relative mt-6 h-[190vh] md:mt-12">
          <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
            <LoopDiagram progress={scrollYProgress} />
          </div>
        </div>

        {/* Loop + limits */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div>
              <h3 className="flex items-center gap-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-fog">
                <ArrowsClockwise size={14} className="text-signal" aria-hidden="true" />
                The loop
              </h3>
              <ol className="mt-4 divide-y divide-white/6 border-y border-white/6">
                {LOOP.map((n, i) => (
                  <li key={n.label} className="flex items-baseline gap-5 py-4">
                    <span className="font-sans text-[11px] tracking-[0.1em] text-fog">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[14.5px] font-medium text-cloud">{n.label}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ash">{n.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <h3 className="flex items-center gap-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-fog">
                <Path size={14} className="text-signal" aria-hidden="true" />
                The limits
              </h3>
              <ul className="mt-4 divide-y divide-white/6 border-y border-white/6">
                {LIMITS.map((l) => (
                  <li key={l.title} className="flex items-start gap-4 py-4">
                    <l.icon size={17} weight="light" className="mt-0.5 shrink-0 text-cloud/80" aria-hidden="true" />
                    <div>
                      <p className="text-[14.5px] font-medium text-cloud">{l.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ash">{l.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Scheduler note */}
        <Reveal delay={0.1}>
          <p className="mt-10 flex items-start gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-[13.5px] leading-relaxed text-ash">
            <Info size={17} weight="light" className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
            <span>
              <span className="text-cloud">Repeats need a real scheduler.</span> The
              skill does not run alone in the background. You set up, check,
              and own any schedule, outside the skill.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
