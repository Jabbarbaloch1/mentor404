"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Github, Twitter, Send } from "lucide-react";
import { mainNav } from "@/lib/site-config";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success("Subscribed. Welcome to the feed.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="font-display text-lg font-semibold text-ink">
              mentor<span className="text-indigo">4</span>
              <span className="text-violet">0</span>
              <span className="text-indigo">4</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-dim">
              Cybersecurity research, tools, and lab write-ups. Dark web
              intel, offensive & defensive security, daily digests.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a href="https://github.com" aria-label="Github" className="text-ink-dim hover:text-ink">
                <Github size={17} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-ink-dim hover:text-ink">
                <Twitter size={17} />
              </a>
              <a href="mailto:hello@mentor404.com" aria-label="Email" className="text-ink-dim hover:text-ink">
                <Mail size={17} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-ink">Navigate</h4>
            <ul className="mt-4 space-y-2.5">
              {mainNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-dim hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-ink">Categories</h4>
            <ul className="mt-4 space-y-2.5">
              {["Dark Web", "Security", "Tools", "Technology", "News", "Daily Digest"].map(
                (c) => (
                  <li key={c}>
                    <Link
                      href={`/blog?category=${c.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-ink-dim hover:text-ink"
                    >
                      {c}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-ink">
              Threat digest
            </h4>
            <p className="mt-4 text-sm text-ink-dim">
              New write-ups and daily intel, straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label="Subscribe"
                className="flex shrink-0 items-center justify-center rounded-lg bg-indigo px-3.5 text-white transition-transform hover:scale-[1.05] disabled:opacity-60"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Mentor404. All rights reserved.
          </p>
          <p className="font-mono-cyber text-xs text-ink-faint">
            built_with(next.js, prisma, postgres)
          </p>
        </div>
      </div>
    </footer>
  );
}
