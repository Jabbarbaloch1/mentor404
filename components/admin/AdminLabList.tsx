"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

type LabEntry = {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  published: boolean;
};

export default function AdminLabList() {
  const [items, setItems] = useState<LabEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/lab")
      .then((r) => r.json())
      .then((d) => setItems(d.entries || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this lab entry?")) return;
    const res = await fetch(`/api/admin/lab/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((p) => p.filter((x) => x.id !== id));
      toast.success("Entry deleted.");
    } else {
      toast.error("Failed to delete.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Lab</h1>
          <p className="mt-1 text-sm text-ink-dim">Write-ups from experiments and testing.</p>
        </div>
        <Link
          href="/admin/lab/new"
          className="inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          <Plus size={15} />
          New entry
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink-dim">Loading...</p>
      ) : items.length === 0 ? (
        <div className="glow-card rounded-2xl p-8 text-center text-sm text-ink-dim">
          No lab entries yet.
        </div>
      ) : (
        <div className="glow-card overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-faint">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Domain</th>
                <th className="px-5 py-3 font-medium">Difficulty</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-ink">{e.title}</td>
                  <td className="px-5 py-3 text-ink-dim">{e.domain}</td>
                  <td className="px-5 py-3 text-ink-dim">{e.difficulty}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        e.published ? "bg-emerald/15 text-emerald" : "bg-ink-faint/15 text-ink-dim"
                      }`}
                    >
                      {e.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/lab/${e.id}`}
                        className="rounded-md p-1.5 text-ink-dim hover:bg-bg-elevated hover:text-indigo-bright"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="rounded-md p-1.5 text-ink-dim hover:bg-bg-elevated hover:text-rose"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
