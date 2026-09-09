"use client";

import { useState } from "react";
import { Terminal, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function DigestCTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
      toast.success("You're on the list.");
      setEmail("");
    } catch {
      toast.error("Couldn't subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="scanline relative overflow-hidden rounded-3xl border border-line bg-bg-raised p-10 sm:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo/15 blur-[100px]" />

          <div className="relative mx-auto max-w-xl text-center">
            <div className="terminal-chrome mx-auto mb-6 flex w-fit items-center gap-2 rounded-lg px-3 py-2">
              <div className="terminal-dots">
                <span className="bg-rose" />
                <span className="bg-amber" />
                <span className="bg-emerald" />
              </div>
              <Terminal size={13} className="text-ink-faint" />
              <span className="font-mono-cyber text-xs text-ink-dim">
                subscribe.sh
              </span>
            </div>

            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Get the daily threat digest
            </h2>
            <p className="mt-3 text-ink-dim">
              A short, no-fluff roundup of new articles, tools, and notable
              security news — delivered when it matters.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-7 flex max-w-sm gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-full border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex shrink-0 items-center gap-2 rounded-full bg-indigo px-5 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03] disabled:opacity-60"
              >
                <Send size={14} />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
