"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  views: number;
  category: { name: string } | null;
};

export default function AdminPostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This can't be undone.")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((p) => p.filter((x) => x.id !== id));
      toast.success("Post deleted.");
    } else {
      toast.error("Failed to delete.");
    }
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Posts</h1>
          <p className="mt-1 text-sm text-ink-dim">Manage your articles.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          <Plus size={15} />
          New post
        </Link>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={15} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-lg border border-line bg-bg-raised py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="text-sm text-ink-dim">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="glow-card rounded-2xl p-8 text-center text-sm text-ink-dim">
          No posts found.
        </div>
      ) : (
        <div className="glow-card overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-faint">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Views</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-ink">{p.title}</td>
                  <td className="px-5 py-3 text-ink-dim">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald/15 text-emerald"
                          : p.status === "DRAFT"
                          ? "bg-ink-faint/15 text-ink-dim"
                          : "bg-amber/15 text-amber"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-dim">{p.views}</td>
                  <td className="px-5 py-3 text-ink-faint">{formatDate(p.updatedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${p.id}`}
                        className="rounded-md p-1.5 text-ink-dim hover:bg-bg-elevated hover:text-indigo-bright"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
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
