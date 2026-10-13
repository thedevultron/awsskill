import { motion, useReducedMotion } from "framer-motion";
import { DownloadSimple, Key, ShieldCheck, UserCheck } from "@phosphor-icons/react";
import { EASE, Pill, Reveal } from "./ui";
import { DOWNLOAD_URL, PUBLISH_META, SKY_IMAGE, ZIP_NAME } from "../config";

const TRUST = [
  { icon: ShieldCheck, label: "Plan-only by default" },
  { icon: Key, label: "No credentials in chat" },
  { icon: UserCheck, label: "Approval for big actions" },
];

export default function FinalCTA() {
  const reduce = useReducedMotion();

  return (
    <section id="download" aria-labelledby="download-title" className="relative overflow-hidden bg-obsidian">
      {/* Finale atmosphere */}
      <img
        src={SKY_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-bottom opacity-25 saturate-[0.45] brightness-[0.45]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-[10%] h-[260px] bg-[radial-gradient(50%_100%_at_50%_100%,rgba(64,138,193,0.14),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-obsidian to-transparent" />

      <div className="relative mx-auto max-w-[1200px] px-5 py-32 text-center md:px-8 md:py-44">
        <Reveal>
          <Pill>Free download</Pill>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            id="download-title"
            className="mx-auto mt-7 max-w-3xl text-balance font-serif text-[clamp(2.6rem,7vw,5rem)] leading-[0.98] tracking-[-0.015em] text-pure"
          >
            Download <em className="text-pale-iris">AWS Advisor</em>.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-balance text-[15.5px] font-light leading-relaxed text-ash md:text-[17px]">
            Free to get. Easy to carry. Plan only by default. You stay in
            charge of each choice and each step.
          </p>
        </Reveal>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
          className="mt-11"
        >
          <a
            href={DOWNLOAD_URL}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-pure px-9 py-5 text-[16px] font-medium text-void shadow-[0_18px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:bg-cloud hover:shadow-[0_18px_38px_rgba(0,0,0,0.4)] sm:w-auto"
          >
            Download {ZIP_NAME}
            <DownloadSimple size={17} weight="bold" className="transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
          <p className="mt-5 text-[13px] text-ash">Created by Amir Bagawan</p>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Guarantees">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2 text-ash">
                <t.icon size={14} className="text-cloud/85" aria-hidden="true" />
                <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]">{t.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Release details */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-20 max-w-4xl">
            <p className="font-sans text-[9.5px] uppercase tracking-[0.3em] text-fog">
              Release details
            </p>
            <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 min-[420px]:grid-cols-2 sm:grid-cols-3">
              {PUBLISH_META.map((m) => (
                <div key={m.label} className="bg-obsidian/90 px-5 py-5 text-left backdrop-blur-sm">
                  <dt className="font-sans text-[9.5px] uppercase tracking-[0.18em] text-fog">
                    {m.label}
                  </dt>
                  <dd className="mt-2 break-words font-sans text-[12px] leading-relaxed text-ash">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.14em] text-fog">
              Version 1.0.0. MIT license. Support on GitHub Issues.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
