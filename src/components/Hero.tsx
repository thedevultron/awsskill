import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, DownloadSimple, Key, ShieldCheck, UserCheck } from "@phosphor-icons/react";
import { EASE } from "./ui";
import { DOWNLOAD_URL, SKY_IMAGE } from "../config";

const TRUST = [
  { icon: ShieldCheck, label: "Plan-only by default" },
  { icon: Key, label: "No credentials in chat" },
  { icon: UserCheck, label: "Human approval for big actions" },
];

const LINES = [
  <>Make AWS choices</>,
  <>
    you can <em>explain</em>
  </>,
  <>and check.</>,
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  /* Parallax on scroll away */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  /* Cursor-follow spotlight (fine pointers, motion allowed) */
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const spotlight = useMotionTemplate`radial-gradient(580px circle at ${mx}px ${my}px, rgba(132,125,255,0.09), transparent 70%)`;
  const finePointer = typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches;

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col overflow-hidden"
      onMouseMove={
        finePointer && !reduce
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(e.clientX - r.left);
              my.set(e.clientY - r.top);
            }
          : undefined
      }
    >
      {/* Atmosphere: sky photo, cool tone */}
      <motion.img
        src={SKY_IMAGE}
        alt=""
        aria-hidden="true"
        style={reduce ? undefined : { y: imageY }}
        className="absolute inset-0 h-[115%] w-full object-cover opacity-40 saturate-[0.5] brightness-[0.5] contrast-[1.05]"
      />
      {/* Horizon glow + canvas blends */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[16%] h-[240px] bg-[radial-gradient(50%_100%_at_50%_100%,rgba(64,138,193,0.16),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
      {/* Ambient iris glow */}
      <div
        aria-hidden="true"
        className="breathe pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[520px] max-w-[92vw] rounded-full bg-[radial-gradient(circle,rgba(132,125,255,0.13),transparent_65%)]"
      />
      {/* Cursor spotlight */}
      {finePointer && !reduce && (
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      )}

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-5 pb-32 pt-36 text-center md:px-8"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 font-sans text-[10.5px] font-medium uppercase tracking-[0.18em] text-cloud backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Free · Portable · Plan-only
          </span>
        </motion.div>

        <h1 className="mt-8 font-serif text-[clamp(2.9rem,9vw,6.6rem)] leading-[0.95] tracking-[-0.015em] text-pure">
          {LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.15, delay: 0.28 + i * 0.13, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: EASE }}
          className="mt-7 max-w-[600px] text-balance text-[15.5px] font-light leading-relaxed text-ash md:text-[17px]"
        >
          A free AWS helper for your coding agent. Get simple plans, clear costs, and
          safe steps.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE }}
          className="mt-10 flex w-full flex-col items-center gap-3.5 sm:w-auto sm:flex-row"
        >
          <a
            href={DOWNLOAD_URL}
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-pure px-7 py-4 text-[15px] font-medium text-void shadow-[0_18px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-cloud hover:shadow-[0_18px_32px_rgba(0,0,0,0.35)] sm:w-auto"
          >
            Download AWS Advisor
            <DownloadSimple size={16} weight="bold" className="transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
          <a
            href="#features"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-4 text-[15px] text-cloud transition-colors duration-200 hover:border-white/50 hover:bg-white/5 sm:w-auto"
          >
            Explore the features
            <ArrowDown size={15} className="transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.ul
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.25, ease: EASE }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          aria-label="Guarantees"
        >
          {TRUST.map((t) => (
            <li key={t.label} className="flex items-center gap-2 text-ash">
              <t.icon size={14} weight="regular" className="text-cloud/85" aria-hidden="true" />
              <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]">{t.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.7, ease: EASE }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="font-sans text-[9.5px] uppercase tracking-[0.3em] text-fog">Scroll</span>
        <span className="cue-line block h-10 w-px bg-white/10" />
      </motion.div>
    </section>
  );
}
