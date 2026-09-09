"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Terminal, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back.");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-grid relative flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo/15 blur-[120px]" />

      <div className="glow-card relative w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/15 text-indigo-bright">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              mentor<span className="text-indigo">4</span>
              <span className="text-violet">0</span>
              <span className="text-indigo">4</span>
            </p>
            <p className="font-mono-cyber text-[11px] text-ink-faint">
              admin_console
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 text-ink-dim">
          <Terminal size={14} />
          <p className="text-sm">Authenticate to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-ink-dim">
              <Mail size={12} /> Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
              placeholder="admin@mentor404.com"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-ink-dim">
              <Lock size={12} /> Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-indigo px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
