import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, List, X } from "@phosphor-icons/react";
import { EASE, Logo } from "./ui";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Automation", href: "#automation" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b backdrop-blur-[24px] transition-colors duration-300 ${
          scrolled ? "border-white/10 bg-obsidian/85" : "border-white/5 bg-obsidian/55"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8"
        >
          <a href="#top" aria-label="AWS Advisor: back to top" className="shrink-0">
            <Logo />
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3.5 py-2 text-[14px] text-ash transition-colors duration-200 hover:bg-white/5 hover:text-cloud"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="group hidden items-center gap-2 rounded-full bg-pure px-5 py-2.5 text-[14px] font-medium text-void transition-colors duration-200 hover:bg-cloud sm:inline-flex"
            >
              Download
              <ArrowDown size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/8 text-cloud transition-colors duration-200 hover:bg-white/15 lg:hidden"
            >
              {open ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden border-t border-white/8 bg-obsidian/95 lg:hidden"
            >
              <div className="space-y-1 px-5 py-5">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: EASE }}
                    className="block min-h-[44px] rounded-lg px-3 py-3.5 font-serif text-2xl text-cloud transition-colors duration-200 hover:bg-white/5"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#download"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.3, ease: EASE }}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-pure px-5 py-3.5 text-[15px] font-medium text-void"
                >
                  Download AWS Advisor
                  <ArrowDown size={15} weight="bold" />
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
