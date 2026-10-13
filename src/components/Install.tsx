import { ArrowUpRight, ArrowsClockwise, Copy, FileZip, Info, type Icon } from "@phosphor-icons/react";
import { Reveal, SectionHeading } from "./ui";
import { SPEC_URL, ZIP_NAME } from "../config";

type Step = { icon: Icon; title: string; desc: React.ReactNode };

const STEPS: Step[] = [
  {
    icon: FileZip,
    title: "Download & extract",
    desc: (
      <>
        Get <span className="font-sans text-[13px] text-cloud">{ZIP_NAME}</span> and extract it
        anywhere you like.
      </>
    ),
  },
  {
    icon: Copy,
    title: "Copy the folder",
    desc: (
      <>
        Move the complete <span className="font-sans text-[13px] text-cloud">aws-advisor</span>{" "}
        folder into your coding agent's supported skills directory.
      </>
    ),
  },
  {
    icon: ArrowsClockwise,
    title: "Reload & invoke",
    desc: "Reload your agent and chat. The skill starts when it fits your question.",
  },
];

export default function Install() {
  return (
    <section id="install" aria-labelledby="install-title" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          eyebrow="Install"
          title={
            <span id="install-title">
              Three steps to your <em className="text-pale-iris">first answer</em>.
            </span>
          }
          sub="No account. No setup. No background apps. If your agent takes skills, you are set."
        />

        <div className="mt-16 grid gap-3 md:mt-20 md:grid-cols-3 md:gap-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-graphite p-7 transition-colors duration-200 hover:border-white/10 hover:bg-steel md:p-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-5 select-none font-serif text-[7rem] leading-none text-white/[0.05] transition-colors duration-200 group-hover:text-white/[0.08]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-cloud transition-colors duration-200 group-hover:bg-white/10">
                  <s.icon size={19} weight="light" aria-hidden="true" />
                </span>
                <h3 className="relative mt-6 font-serif text-[22px] leading-tight text-cloud">
                  {s.title}
                </h3>
                <p className="relative mt-3 text-[14px] leading-relaxed text-ash">{s.desc}</p>
                {i === 1 && (
                  <p className="relative mt-5 inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-abyss/60 px-3.5 py-2 font-mono text-[11.5px] text-ash">
                    <span className="text-signal">└─</span> .agent/skills/
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Host note */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:flex-row sm:items-center md:p-6">
            <Info size={18} weight="light" className="shrink-0 text-signal" aria-hidden="true" />
            <p className="text-[13.5px] leading-relaxed text-ash">
              <span className="text-cloud">Paths vary by host.</span> Check your agent docs
              for where skills live, or read the open spec at{" "}
              <a
                href={SPEC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-sans text-[12.5px] text-cloud underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:decoration-white/60"
              >
                agentskills.io/specification
                <ArrowUpRight size={12} className="inline" aria-hidden="true" />
              </a>
              <span className="mt-1 block text-fog">
                The <span className="font-sans text-[12px]">.agent/skills/</span> path above is a
                sample. Your host may differ.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
