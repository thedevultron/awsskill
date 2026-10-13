import { motion, useReducedMotion } from "framer-motion";
import {
  DownloadSimple,
  FileText,
  FileZip,
  FolderOpen,
  Terminal,
  type Icon,
} from "@phosphor-icons/react";
import { EASE, Reveal, SectionHeading } from "./ui";
import { DOWNLOAD_URL, ZIP_NAME } from "../config";

type ZipEntry = { icon: Icon; name: string; desc: string };

const FILES: ZipEntry[] = [
  { icon: FileText, name: "SKILL.md", desc: "The skill rules: when to start and how to act." },
  { icon: FileText, name: "customization.md", desc: "Optional profile questions." },
  { icon: FileText, name: "automate.md", desc: "Automation patterns and safety rules." },
  { icon: FileText, name: "loop.md", desc: "The bounded run-loop specification." },
  { icon: FileText, name: "goal.md", desc: "Goal tracking templates." },
  { icon: FolderOpen, name: "references/", desc: "AWS service and pricing references in Markdown." },
  { icon: Terminal, name: "scripts/", desc: "Helper scripts for feed and price lookups." },
  { icon: FolderOpen, name: "memory/", desc: "Optional memory templates. Used only with your yes." },
];

export default function Contents() {
  const reduce = useReducedMotion();

  return (
    <section id="contents" aria-labelledby="contents-title" className="relative bg-abyss py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Copy + download */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Download contents"
              title={
                <span id="contents-title">
                  Everything ships <em className="text-pale-iris">in the ZIP</em>.
                </span>
              }
              sub="Plain Markdown and small scripts. Open any file. Nothing is hidden."
            />
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              className="mt-9"
            >
              <a
                href={DOWNLOAD_URL}
                className="group inline-flex items-center gap-2.5 rounded-full bg-pure px-7 py-4 text-[15px] font-medium text-void shadow-[0_18px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-cloud hover:shadow-[0_18px_32px_rgba(0,0,0,0.35)]"
              >
                Download {ZIP_NAME}
                <DownloadSimple size={16} weight="bold" className="transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
              <p className="mt-5 font-sans text-[10.5px] uppercase tracking-[0.18em] text-fog">
                Free · No account · No setup
              </p>
            </motion.div>
          </div>

          {/* ZIP preview card */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[20px] border border-white/8 bg-graphite">
              <div className="flex items-center gap-3 border-b border-white/8 px-6 py-4">
                <FileZip size={20} weight="light" className="text-cloud" aria-hidden="true" />
                <span className="font-sans text-[13px] text-cloud">{ZIP_NAME}</span>
                <span className="ml-auto rounded-full border border-white/12 bg-white/5 px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-fog">
                  Free
                </span>
              </div>
              <ul>
                {FILES.map((f, i) => (
                  <motion.li
                    key={f.name}
                    initial={reduce ? false : { opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: EASE }}
                    className="group flex items-start gap-4 border-b border-white/5 px-6 py-4 transition-colors duration-200 last:border-0 hover:bg-white/[0.04]"
                  >
                    <f.icon
                      size={17}
                      weight="light"
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-fog transition-colors duration-200 group-hover:text-cloud"
                    />
                    <div className="min-w-0">
                      <p className="font-sans text-[13px] text-cloud">{f.name}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ash">{f.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="border-t border-white/8 bg-obsidian/40 px-6 py-4">
                <p className="font-sans text-[9.5px] uppercase leading-relaxed tracking-[0.16em] text-fog">
                  Extract · Copy the aws-advisor folder · Reload your agent
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
