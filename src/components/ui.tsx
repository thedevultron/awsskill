import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** The signature long atmospheric ease from the motion system. */
export const EASE: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];

/* ------------------------------------------------------------------ */
/* Reveal: scroll fade and rise, honors reduced motion          */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Pill: uppercase mono eyebrow chip                                  */
/* ------------------------------------------------------------------ */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 font-sans text-[10.5px] font-medium uppercase tracking-[0.18em] text-cloud">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading: eyebrow plus serif display plus sub                      */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <Reveal>
        <Pill>{eyebrow}</Pill>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-6 text-balance font-serif text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.01em] text-cloud">
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 text-[15px] leading-relaxed text-ash md:text-base ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {sub}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo: compass mark plus wordmark                                      */
/* ------------------------------------------------------------------ */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="8.5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M16 10.5 L19 19 L16 17.2 L13 19 Z" fill="#ffffff" />
      </svg>
      {!compact && (
        <span className="flex items-baseline gap-2">
          <span className="font-serif text-[19px] leading-none text-pure">AWS Advisor</span>
          <span className="hidden rounded-full border border-white/12 bg-white/8 px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-fog sm:inline-block">
            Skill
          </span>
        </span>
      )}
    </span>
  );
}
