"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import CategoryBadge from "@/components/ui/CategoryBadge";

type Category = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  _count: { posts: number; resources: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#5b5fef");
  const [icon, setIcon] = useState("Folder");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, icon }),
      });
      if (!res.ok) throw new Error();
      toast.success("Category created.");
      setName("");
      load();
    } catch {
      toast.error("Failed to create category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>
        <p className="mt-1 text-sm text-ink-dim">Organize content by topic.</p>
      </div>

      <div className="glow-card mb-8 rounded-2xl p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">Add category</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-ink-dim">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-line bg-bg-raised px-3 py-2 text-sm text-ink focus:border-indigo focus:outline-none"
              placeholder="e.g. Malware Analysis"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-ink-dim">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-[38px] w-14 rounded-lg border border-line bg-bg-raised"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-ink-dim">Icon (lucide name)</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="rounded-lg border border-line bg-bg-raised px-3 py-2 text-sm text-ink focus:border-indigo focus:outline-none"
              placeholder="Shield"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo px-4 py-2 text-sm font-medium text-white hover:scale-[1.02] disabled:opacity-60"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ink-dim">Loading...</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="glow-card flex items-center justify-between rounded-xl p-4">
              <CategoryBadge name={c.name} color={c.color} icon={c.icon} size="md" />
              <span className="text-xs text-ink-faint">
                {c._count.posts} posts · {c._count.resources} resources
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
