"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

export type LabFormValue = {
  title: string;
  summary?: string | null;
  objective?: string | null;
  impact?: string | null;
  content: string;
  domain: "WEB" | "NETWORK" | "MALWARE" | "FORENSICS" | "CLOUD" | "MOBILE" | "OSINT" | "OTHER";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  toolsUsed: string[];
  published?: boolean;
};

export default function LabForm({
  initial,
  entryId,
}: {
  initial?: Partial<LabFormValue>;
  entryId?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toolsInput, setToolsInput] = useState((initial?.toolsUsed || []).join(", "));
  const [form, setForm] = useState<LabFormValue>({
    title: initial?.title || "",
    summary: initial?.summary || "",
    objective: initial?.objective || "",
    impact: initial?.impact || "",
    content: initial?.content || "",
    domain: initial?.domain || "WEB",
    difficulty: initial?.difficulty || "BEGINNER",
    toolsUsed: initial?.toolsUsed || [],
    published: initial?.published || false,
  });

  async function handleSave(publish?: boolean) {
    if (!form.title.trim() || !form.content || form.content === "<p></p>") {
      toast.error("Title and content are required.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      toolsUsed: toolsInput.split(",").map((t) => t.trim()).filter(Boolean),
      published: publish ?? form.published,
    };
    try {
      const res = await fetch(entryId ? `/api/admin/lab/${entryId}` : "/api/admin/lab", {
        method: entryId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      toast.success(entryId ? "Entry updated." : "Entry created.");
      if (!entryId) router.push(`/admin/lab/${data.entry.id}`);
      else router.refresh();
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Lab entry title"
          className="w-full border-none bg-transparent font-display text-3xl font-semibold text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <textarea
          value={form.summary || ""}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="One or two sentence summary..."
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-dim">
              Objective
              <span className="font-normal text-ink-faint">— what this test set out to find</span>
            </label>
            <textarea
              value={form.objective || ""}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              placeholder="e.g. Determine whether the checkout flow is vulnerable to IDOR via order ID enumeration."
              rows={3}
              className="w-full resize-none rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-dim">
              Impact
              <span className="font-normal text-ink-faint">— real-world risk if confirmed</span>
            </label>
            <textarea
              value={form.impact || ""}
              onChange={(e) => setForm({ ...form, impact: e.target.value })}
              placeholder="e.g. An attacker could view or modify any user's order history and PII without authorization."
              rows={3}
              className="w-full resize-none rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5">
          <Editor content={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="glow-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">Publish</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full rounded-lg border border-line px-4 py-2.5 text-sm text-ink-dim hover:bg-bg-elevated disabled:opacity-60"
            >
              Save draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-medium text-white hover:scale-[1.01] disabled:opacity-60"
            >
              <Save size={14} />
              Publish
            </button>
          </div>
        </div>

        <div className="glow-card rounded-2xl p-4">
          <label className="mb-1.5 block text-xs text-ink-dim">Domain</label>
          <select
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value as LabFormValue["domain"] })}
            className="mb-4 w-full rounded-lg border border-line bg-bg-raised px-3 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
          >
            {["WEB", "NETWORK", "MALWARE", "FORENSICS", "CLOUD", "MOBILE", "OSINT", "OTHER"].map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <label className="mb-1.5 block text-xs text-ink-dim">Difficulty</label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value as LabFormValue["difficulty"] })}
            className="w-full rounded-lg border border-line bg-bg-raised px-3 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
          >
            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="glow-card rounded-2xl p-4">
          <label className="mb-1.5 block text-xs text-ink-dim">
            Tools used (comma separated)
          </label>
          <input
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
            placeholder="nmap, burpsuite, wireshark"
            className="w-full rounded-lg border border-line bg-bg-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
