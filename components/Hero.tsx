"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck, Terminal, ArrowRight } from "lucide-react";

const ThreatGlobe = dynamic(() => import("./3d/ThreatGlobe"), {
  ssr: false,
  loading: () => null,
});

const TYPE_LINES = [
  "$ nmap -sV target.mentor404.local",
  "$ initiating recon module...",
  "$ analyzing threat surface...",
  "$ welcome to mentor404_",
];

function TerminalTyping() {
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const current = TYPE_LINES[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 35);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1100);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 600);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 18);
      } else {
        setLineIdx((i) => (i + 1) % TYPE_LINES.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, lineIdx]);

  return (
    <span className="font-mono-cyber text-cyan">
      {text}
      <span className="cursor-blink" />
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="bg-grid relative overflow-hidden border-b border-line"
    >
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[560px] w-[560px] rounded-full bg-indigo/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-[400px] w-[400px] rounded-full bg-violet/10 blur-[110px]" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-bg-raised px-3.5 py-1.5">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald text-emerald" />
            <span className="text-xs text-ink-dim">
              Live threat feed active
            </span>
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Decoding the
            <br />
            <span className="relative inline-block">
              digital
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 50 2, 100 6 T 198 5"
                  stroke="#5B5FEF"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            underworld.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-dim">
            Real threats, broken down in plain language. Mentor404 tracks
            what&apos;s moving in the dark web, dissects attacks and defenses,
            and hands you the tools to keep up — no fluff, no theory-only
            takes. Just field-tested security research, published as it happens.
          </p>

          <div className="mt-6 h-6 text-sm">
            <Terminal className="mr-2 inline-block h-4 w-4 text-ink-faint" />
            <TerminalTyping />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full bg-indigo px-6 py-3.5 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo/30"
            >
              Read the blog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-indigo"
            >
              <ShieldCheck className="h-4 w-4" />
              Explore the lab
            </Link>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <dt className="font-display text-2xl font-semibold text-ink">
                50+
              </dt>
              <dd className="mt-1 text-xs text-ink-dim">
                Articles & write-ups
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-semibold text-ink">
                6
              </dt>
              <dd className="mt-1 text-xs text-ink-dim">Coverage domains</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-semibold text-ink">
                Daily
              </dt>
              <dd className="mt-1 text-xs text-ink-dim">Threat digest</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative aspect-square w-full max-w-lg">
            <ThreatGlobe />

            {/* floating status chips over the globe */}
            <div className="pointer-events-none absolute left-2 top-6 flex items-center gap-2 rounded-lg border border-line bg-bg/80 px-3 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-rose" />
              <span className="font-mono-cyber text-[11px] text-ink-dim">
                node.compromised.detect()
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-8 right-0 flex items-center gap-2 rounded-lg border border-line bg-bg/80 px-3 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              <span className="font-mono-cyber text-[11px] text-ink-dim">
                packets: analyzing
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
