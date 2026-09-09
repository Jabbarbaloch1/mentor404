"use client";

import { useState } from "react";
import { Mail, Send, MapPin, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent. I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="font-mono-cyber mb-3 text-xs uppercase tracking-widest text-indigo-bright">
            Get in touch
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Let&apos;s talk security
          </h1>
          <p className="mt-4 text-ink-dim">
            Questions about an article, a collaboration idea, or a tip on
            something worth covering — reach out.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo/15 text-indigo-bright">
                <Mail size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Email</p>
                <p className="text-sm text-ink-dim">hello@mentor404.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo/15 text-indigo-bright">
                <MessageSquare size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Response time</p>
                <p className="text-sm text-ink-dim">Usually within 24–48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo/15 text-indigo-bright">
                <MapPin size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Operating from</p>
                <p className="text-sm text-ink-dim">Everywhere · Remote-first</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glow-card rounded-2xl p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-ink-dim">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-ink-dim">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
                placeholder="you@domain.com"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs text-ink-dim">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
              placeholder="What's this about?"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs text-ink-dim">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
              placeholder="Tell me what's on your mind..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo px-6 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
          >
            <Send size={15} />
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
