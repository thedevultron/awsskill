import type { ReactNode } from "react";
import {
  ArrowsClockwise,
  Blueprint,
  ChatTeardropText,
  Coins,
  Crosshair,
  FileText,
  Flag,
  GitFork,
  Rss,
  type Icon,
} from "@phosphor-icons/react";
import { Reveal, SectionHeading } from "./ui";

type Feature = {
  icon: Icon;
  title: string;
  desc: string;
  bg: string;
  dark: boolean; // true → obsidian text on light tile
  span: string;
  detail?: ReactNode;
};

const OBJECTIVES = [
  "Cost",
  "Performance",
  "Reliability",
  "Security",
  "Operations",
  "Sustainability",
  "Delivery speed",
];

const FEATURES: Feature[] = [
  {
    icon: ChatTeardropText,
    title: "One question at a time",
    desc: "Opt in and go at your pace. Answer what matters. Skip the rest.",
    bg: "#dd90d8",
    dark: true,
    span: "lg:col-span-7",
    detail: (
      <p className="mt-auto border-l-2 border-obsidian/25 pl-3.5 pt-1 font-sans text-[12px] leading-relaxed text-obsidian/70">
        &ldquo;Which region are you deployed in?&rdquo;
      </p>
    ),
  },
  {
    icon: Blueprint,
    title: "Architecture and service guidance",
    desc: "Pick services and shapes that fit. Backed by current AWS links.",
    bg: "#847dff",
    dark: true,
    span: "lg:col-span-5",
  },
  {
    icon: Crosshair,
    title: "Objectives you choose",
    desc: "Set what matters most. Options are ranked by your goals.",
    bg: "#90b8f0",
    dark: true,
    span: "lg:col-span-5",
    detail: (
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4" aria-label="Supported objectives">
        {OBJECTIVES.map((o) => (
          <li
            key={o}
            className="rounded-full border border-obsidian/25 px-2.5 py-1 font-sans text-[9.5px] font-medium uppercase tracking-[0.12em] text-obsidian/80"
          >
            {o}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: GitFork,
    title: "Rationale and alternatives",
    desc: "See why an option fits and what else was considered. Then decide.",
    bg: "#d1c9ff",
    dark: true,
    span: "lg:col-span-7",
  },
  {
    icon: Rss,
    title: "AWS announcement updates",
    desc: "See recent AWS news with links to the source. Stay current.",
    bg: "#4b49aa",
    dark: false,
    span: "lg:col-span-4",
  },
  {
    icon: Coins,
    title: "Regional unit-price lookup",
    desc: "Unit prices help you compare. They are not full cost guesses.",
    bg: "#00b3dd",
    dark: true,
    span: "lg:col-span-4",
  },
  {
    icon: ArrowsClockwise,
    title: "Automation and a bounded loop",
    desc: "Plan first, dry run next, with stop rules. Safe by default.",
    bg: "#2e2e2e",
    dark: false,
    span: "lg:col-span-4",
  },
  {
    icon: Flag,
    title: "Goal tracking",
    desc: "Set a clear goal. Check each step moves you closer.",
    bg: "#847dff",
    dark: true,
    span: "lg:col-span-6",
  },
  {
    icon: FileText,
    title: "Portable references and scripts",
    desc: "Plain Markdown and small scripts. You and your agent can read them.",
    bg: "#2e2e2e",
    dark: false,
    span: "lg:col-span-6",
  },
];

function FeatureCard({ f, i }: { f: Feature; i: number }) {
  return (
    <Reveal delay={(i % 3) * 0.09} className={`h-full ${f.span}`}>
      <article
        className={`group flex h-full min-h-0 flex-col break-words rounded-[30px] p-7 transition-all duration-200 ease-out hover:-translate-y-1 hover:brightness-[1.06] sm:min-h-[260px] md:p-8 ${
          f.dark ? "text-obsidian" : "text-cloud"
        }`}
        style={{ backgroundColor: f.bg }}
      >
        <f.icon
          size={28}
          weight="light"
          aria-hidden="true"
          className={f.dark ? "text-obsidian" : "text-pure"}
        />
        <h3 className="mt-6 max-w-[26ch] text-balance font-serif text-[24px] leading-[1.08] md:text-[27px]">
          {f.title}
        </h3>
        <p
          className={`mt-3 max-w-[48ch] text-[14px] leading-relaxed ${
            f.dark ? "text-obsidian/75" : "text-pure/75"
          }`}
        >
          {f.desc}
        </p>
        {f.detail}
      </article>
    </Reveal>
  );
}

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="relative bg-abyss py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          eyebrow="What's inside"
          title={
            <span id="features-title">
              Nine capabilities. <em className="text-pale-iris">One</em> portable skill.
            </span>
          }
          sub="Plain Markdown you can read. Your agent can load it. Use what you need."
        />

        <div className="mt-16 grid gap-3 md:mt-20 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
