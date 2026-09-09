"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Save, Eye, ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

export type PostFormValue = {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  featured?: boolean;
  categoryId?: string | null;
  tagIds?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export default function PostForm({
  initial,
  postId,
}: {
  initial?: Partial<PostFormValue>;
  postId?: string;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<PostFormValue>({
    title: initial?.title || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    coverImage: initial?.coverImage || "",
    status: initial?.status || "DRAFT",
    featured: initial?.featured || false,
    categoryId: initial?.categoryId || null,
    tagIds: initial?.tagIds || [],
    metaTitle: initial?.metaTitle || "",
    metaDescription: initial?.metaDescription || "",
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
    fetch("/api/admin/tags").then((r) => r.json()).then((d) => setTags(d.tags || []));
  }, []);

  const handleCoverUpload = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, coverImage: data.url }));
      toast.success("Cover image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  async function handleSave(status?: PostFormValue["status"]) {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.content || form.content === "<p></p>") {
      toast.error("Content can't be empty.");
      return;
    }

    setSaving(true);
    const payload = { ...form, status: status || form.status };

    try {
      const res = await fetch(postId ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
        method: postId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data.error) || "Save failed");

      toast.success(postId ? "Post updated." : "Post created.");
      if (!postId) {
        router.push(`/admin/posts/${data.post.id}`);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Failed to save post.");
    } finally {
      setSaving(false);
    }
  }

  function toggleTag(id: string) {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds?.includes(id)
        ? f.tagIds.filter((t) => t !== id)
        : [...(f.tagIds || []), id],
    }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Post title"
          className="w-full border-none bg-transparent font-display text-3xl font-semibold text-ink placeholder:text-ink-faint focus:outline-none"
        />

        <textarea
          value={form.excerpt || ""}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          placeholder="Short excerpt shown in cards and previews..."
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-line bg-bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
        />

        <div className="mt-5">
          <Editor
            content={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="glow-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">Publish</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleSave("DRAFT")}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm text-ink-dim hover:bg-bg-elevated disabled:opacity-60"
            >
              <Save size={14} />
              Save draft
            </button>
            <button
              onClick={() => handleSave("PUBLISHED")}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-medium text-white hover:scale-[1.01] disabled:opacity-60"
            >
              <Eye size={14} />
              {form.status === "PUBLISHED" ? "Update & publish" : "Publish"}
            </button>
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-ink-dim">
            <input
              type="checkbox"
              checked={form.featured || false}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-line"
            />
            Feature this post
          </label>
        </div>

        <div className="glow-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">Cover image</h3>
          {form.coverImage ? (
            <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
              <Image src={form.coverImage} alt="Cover" fill className="object-cover" />
              <button
                onClick={() => setForm({ ...form, coverImage: "" })}
                className="absolute right-2 top-2 rounded-full bg-bg/80 p-1.5 text-ink hover:text-rose"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line text-ink-faint hover:border-indigo hover:text-indigo-bright">
              <ImagePlus size={20} />
              <span className="text-xs">{uploading ? "Uploading..." : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <div className="glow-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">Category</h3>
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

        <div className="glow-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTag(t.id)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  form.tagIds?.includes(t.id)
                    ? "border-indigo bg-indigo/15 text-indigo-bright"
                    : "border-line text-ink-dim hover:border-line-bright"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="glow-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">SEO</h3>
          <label className="mb-1.5 block text-xs text-ink-dim">Meta title</label>
          <input
            value={form.metaTitle || ""}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            className="mb-3 w-full rounded-lg border border-line bg-bg-raised px-3 py-2 text-sm text-ink focus:border-indigo focus:outline-none"
          />
          <label className="mb-1.5 block text-xs text-ink-dim">Meta description</label>
          <textarea
            rows={2}
            value={form.metaDescription || ""}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            className="w-full resize-none rounded-lg border border-line bg-bg-raised px-3 py-2 text-sm text-ink focus:border-indigo focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
