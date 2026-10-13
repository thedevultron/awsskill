import { ArrowUpRight } from "@phosphor-icons/react";
import { Logo } from "./ui";
import { SPEC_URL } from "../config";

const EXPLORE = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Automation", href: "#automation" },
  { label: "FAQ", href: "#faq" },
];

const PROJECT = [
  { label: "Download", href: "#download" },
  { label: "Install steps", href: "#install" },
  { label: "What's in the ZIP", href: "#contents" },
  { label: "Privacy & control", href: "#privacy" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-fog">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="inline-flex min-h-[44px] items-center py-2 text-[14px] text-ash transition-colors duration-200 hover:text-cloud"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-abyss">
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <Logo />
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-ash">
              A free AWS skill for plans, costs, and safe steps. Plan only by default.
            </p>
            <a
              href={SPEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.16em] text-ash underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-cloud hover:decoration-white/50"
            >
              Agent Skills spec
              <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
          <LinkColumn title="Explore" links={EXPLORE} />
          <LinkColumn title="Project" links={PROJECT} />
        </div>

        <div className="mt-14 border-t border-white/5 pt-7">
          <p className="max-w-[86ch] text-[12px] leading-relaxed text-fog">
            AWS Advisor is an independent skill distributed as a free download. It is not
            affiliated with, endorsed by, or sponsored by Amazon Web Services, Inc. or Amazon.com,
            Inc. &ldquo;AWS&rdquo; is a trademark of Amazon.com, Inc. References to AWS services are
            informational only.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-[11px] tracking-[0.08em] text-fog">
              © {new Date().getFullYear()} AWS Advisor. Created by Amir Bagawan. Free to use.
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-fog">
              Version 1.0.0. Created by Amir Bagawan.
            </p>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        <p className="-mb-[0.23em] text-center font-serif text-[15.5vw] leading-none tracking-[-0.02em] text-white/[0.035]">
          AWS Advisor
        </p>
      </div>
    </footer>
  );
}
