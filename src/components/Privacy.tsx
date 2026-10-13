import {
  Brain,
  ChatTeardropText,
  CursorClick,
  Prohibit,
  SlidersHorizontal,
  UserFocus,
  type Icon,
} from "@phosphor-icons/react";
import { Reveal, SectionHeading } from "./ui";

const CONTROLS: { icon: Icon; title: string; desc: string }[] = [
  {
    icon: UserFocus,
    title: "Your profile is optional",
    desc: "Profile questions are opt in. Skip them. The skill still works.",
  },
  {
    icon: Brain,
    title: "Memory needs a yes",
    desc: "Nothing saves to memory unless you approve. Review or delete notes any time.",
  },
  {
    icon: SlidersHorizontal,
    title: "You set the limits",
    desc: "Choose what is allowed, what needs approval, and what is off limits.",
  },
  {
    icon: Prohibit,
    title: "No credentials in chat",
    desc: "The skill never asks for AWS keys in chat. Scripts use public links only.",
  },
  {
    icon: CursorClick,
    title: "Confirm what counts",
    desc: "Big or final actions need your clear yes before they run.",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          eyebrow="Privacy & control"
          title={
            <span id="privacy-title">
              Your rules. Your data. <em className="text-pale-iris">Your</em> call.
            </span>
          }
          sub="The skill runs in your agent, on your call. Nothing saves without your yes."
        />

        <div className="mt-16 grid items-start gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Example dialogue */}
          <Reveal>
            <figure className="rounded-2xl border border-white/8 bg-graphite p-6 md:p-8">
              <figcaption className="flex items-center gap-2.5 font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-fog">
                <ChatTeardropText size={14} weight="light" aria-hidden="true" />
                Example dialogue
              </figcaption>

              <div className="mt-7 space-y-4">
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-pure px-5 py-3.5 text-[14px] leading-relaxed text-void">
                    Prefer us-east-1, and keep p95 latency under 100&nbsp;ms.
                  </p>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-steel px-5 py-3.5">
                    <p className="text-[14px] leading-relaxed text-cloud">
                      Understood. Want me to save this to memory for future sessions, or use it just
                      for now?
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-pure px-3.5 py-1.5 text-[12px] font-medium text-void">
                        Save to memory
                      </span>
                      <span className="rounded-full border border-white/20 px-3.5 py-1.5 text-[12px] text-cloud">
                        Just this session
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-7 border-t border-white/8 pt-5 text-[13px] leading-relaxed text-ash">
                Nothing saves to memory unless you approve it. Review or delete
                notes any time.
              </p>
            </figure>
          </Reveal>

          {/* Controls */}
          <div>
            <ul className="divide-y divide-white/8 border-y border-white/8">
              {CONTROLS.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.07}>
                  <li className="group flex items-start gap-4 py-5 transition-colors duration-200 hover:bg-white/[0.025] md:py-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cloud transition-colors duration-200 group-hover:bg-white/10">
                      <c.icon size={17} weight="light" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[15px] font-medium text-cloud">{c.title}</p>
                      <p className="mt-1 max-w-[52ch] text-[13.5px] leading-relaxed text-ash">
                        {c.desc}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2}>
              <p className="mt-6 font-sans text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-fog">
                Not a hosted service: a folder of Markdown and scripts, in your agent.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
