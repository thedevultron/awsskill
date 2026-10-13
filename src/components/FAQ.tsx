import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "@phosphor-icons/react";
import { EASE, Reveal, SectionHeading } from "./ui";
import { SPEC_URL } from "../config";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Which coding agents work with it?",
    a: "Any host that uses the Agent Skills format can load it. Check your host docs for skill support. The open spec is at agentskills.io/specification.",
  },
  {
    q: "Does it need my AWS keys?",
    a: "No. Feed and price scripts need net access, but not AWS keys. The skill never asks for keys in chat.",
  },
  {
    q: "Can it build for me?",
    a: "Not by default. It drafts plans, notes trade-offs, and lists steps. You wire up any build inside limits you set, with your okay.",
  },
  {
    q: "Does it run in the background?",
    a: "No. It runs when you ask in chat. Repeats need a scheduler you set up. It never sets one itself.",
  },
  {
    q: "How much does it cost?",
    a: "The skill is free to get and use. If you use AWS, normal AWS costs still apply.",
  },
  {
    q: "How fresh are the AWS refs?",
    a: "News comes from a public RSS feed, recent items only. Prices are as listed at lookup time and can change. Each cite shows what was checked.",
  },
  {
    q: "Where is the changelog?",
    a: "Each release lists its changes. Full history is in the source repo linked on this page.",
  },
  {
    q: "What saves to memory?",
    a: "Nothing by default. Memory is opt in: the skill asks first, and you can review or delete notes any time.",
  },
];

function Item({
  q,
  a,
  open,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <div className={`border-b border-white/8 transition-colors duration-200 ${open ? "bg-white/[0.02]" : ""}`}>
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`faq-panel-${index}`}
            id={`faq-button-${index}`}
            className="group flex w-full items-center justify-between gap-6 px-2 py-6 text-left"
          >
            <span
              className={`font-serif text-[18px] leading-snug transition-colors duration-200 md:text-[20px] ${
                open ? "text-pure" : "text-cloud group-hover:text-pure"
              }`}
            >
              {q}
            </span>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                open
                  ? "rotate-45 border-pure bg-pure text-obsidian"
                  : "border-white/15 text-cloud group-hover:border-white/35"
              }`}
            >
              <Plus size={14} weight="bold" aria-hidden="true" />
            </span>
          </button>
        </h3>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="max-w-[68ch] px-2 pb-7 text-[14.5px] leading-relaxed text-ash">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-abyss py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <span id="faq-title">
                  Fair questions, <em className="text-pale-iris">straight</em> answers.
                </span>
              }
              sub="Clear facts on agents, keys, pricing, and memory. Before you get it."
            />
            <Reveal delay={0.2}>
              <a
                href={SPEC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 font-sans text-[11.5px] uppercase tracking-[0.16em] text-ash underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-cloud hover:decoration-white/50"
              >
                Agent Skills specification
                <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Reveal>
          </div>

          <div className="border-t border-white/8">
            {FAQS.map((f, i) => (
              <Item
                key={f.q}
                q={f.q}
                a={f.a}
                index={i}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
