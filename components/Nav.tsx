"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Terminal } from "lucide-react";
import { mainNav } from "@/lib/site-config";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-line/70 bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            mentor<span className="text-indigo">4</span>
            <span className="text-violet">0</span>
            <span className="text-indigo">4</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {mainNav.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm transition-colors hover:text-ink ${
                  active ? "text-ink" : "text-ink-dim"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-[17px] left-0 h-[2px] w-full bg-indigo" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden md:inline-flex items-center rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          Get in touch
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-ink"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-bg px-6 py-4 flex flex-col gap-4">
          {mainNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-ink-dim hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex w-fit items-center rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white"
          >
            Get in touch
          </Link>
        </div>
      )}
    </header>
  );
}
