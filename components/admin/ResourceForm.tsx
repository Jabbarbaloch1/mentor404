"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, UploadCloud, X } from "lucide-react";

type Category = { id: string; name: string };

export type ResourceFormValue = {
  title: string;
  description: string;
  type: "TOOL" | "CHEATSHEET" | "LINK" | "DOWNLOAD" | "COURSE";
  url?: string | null;
  fileUrl?: string | null;
  icon?: string | null;
  featured?: boolean;
  published?: boolean;
  categoryId?: string | null;
};

export default function ResourceForm({
  initial,
  resourceId,
}: {
  initial?: Partial<ResourceFormValue>;
  resourceId?: string;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<ResourceFormValue>({
    title: initial?.title || "",
    description: initial?.description || "",
    type: initial?.type || "TOOL",
    url: initial?.url || "",
    fileUrl: initial?.fileUrl || "",
    icon: initial?.icon || "Wrench",
    featured: initial?.featured || false,
    published: initial?.published ?? true,
    categoryId: initial?.categoryId || null,
  });

  async function handleFileUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, fileUrl: data.url }));
      toast.success("File uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  async function handleSave() {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        resourceId ? `/api/admin/resources/${resourceId}` : "/api/admin/resources",
        {
          method: resourceId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error();
      toast.success(resourceId ? "Resource updated." : "Resource created.");
      if (!resourceId) router.push(`/admin/resources/${data.resource.id}`);
      else router.refresh();
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1.5 block text-xs text-ink-dim">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-ink-dim">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full resize-none rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ResourceFormValue["type"] })}
            className="w-full rounded-lg border border-line bg-bg-raised px-3 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
          >
            <option value="TOOL">Tool</option>
            <option value="CHEATSHEET">Cheat Sheet</option>
            <option value="LINK">Link</option>
            <option value="DOWNLOAD">Download</option>
            <option value="COURSE">Course</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-ink-dim">Category</label>
          <select
            value={form.categoryId || ""}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
            className="w-full rounded-lg border border-line bg-bg-raised px-3 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-ink-dim">
          External URL (for tools, links, courses)
        </label>
        <input
          value={form.url || ""}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://..."
          className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-ink-dim">
          Downloadable file (for cheat sheets, downloads)
        </label>
        {form.fileUrl ? (
          <div className="flex items-center justify-between rounded-lg border border-line bg-bg-raised px-3.5 py-2.5">
            <a
              href={form.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm text-cyan hover:underline"
            >
              {form.fileUrl.split("/").pop()}
            </a>
            <button
              type="button"
              onClick={() => setForm({ ...form, fileUrl: "" })}
              className="ml-2 shrink-0 text-ink-faint hover:text-rose"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-line px-3.5 py-3 text-sm text-ink-faint hover:border-indigo hover:text-indigo-bright">
            <UploadCloud size={15} />
            {uploading ? "Uploading..." : "Upload a file"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </label>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-ink-dim">
          Lucide icon name (e.g. Wrench, Shield, Terminal)
        </label>
        <input
          value={form.icon || ""}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="w-full rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink focus:border-indigo focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-dim">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="rounded border-line"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-dim">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded border-line"
          />
          Featured
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-indigo px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        <Save size={15} />
        {saving ? "Saving..." : "Save resource"}
      </button>
    </div>
  );
}
