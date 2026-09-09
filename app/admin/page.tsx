import Link from "next/link";
import { FileText, Wrench, FlaskConical, Mail, Eye, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [
    postCount,
    publishedCount,
    resourceCount,
    labCount,
    unreadMessages,
    subscriberCount,
    recentPosts,
    totalViews,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.resource.count(),
    prisma.labEntry.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.subscriber.count(),
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { category: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
  ]);

  const stats = [
    { label: "Total posts", value: postCount, sub: `${publishedCount} published`, icon: FileText, color: "#5b5fef" },
    { label: "Resources", value: resourceCount, icon: Wrench, color: "#22d3ee" },
    { label: "Lab entries", value: labCount, icon: FlaskConical, color: "#34d399" },
    { label: "Total views", value: totalViews._sum.views || 0, icon: Eye, color: "#f59e0b" },
    { label: "Subscribers", value: subscriberCount, icon: Users, color: "#c084fc" },
    { label: "Unread messages", value: unreadMessages, icon: Mail, color: "#fb7185" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-dim">Overview of Mentor404&apos;s content and activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glow-card rounded-2xl p-4">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${s.color}18`, color: s.color }}
              >
                <Icon size={16} />
              </span>
              <p className="mt-3 font-display text-xl font-semibold text-ink">{s.value}</p>
              <p className="text-xs text-ink-dim">{s.label}</p>
              {s.sub && <p className="text-[11px] text-ink-faint">{s.sub}</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Recently updated posts</h2>
          <Link href="/admin/posts" className="text-sm text-indigo-bright hover:text-indigo">
            View all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="glow-card rounded-2xl p-8 text-center">
            <p className="text-sm text-ink-dim">No posts yet.</p>
            <Link
              href="/admin/posts/new"
              className="mt-3 inline-block rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="glow-card overflow-hidden rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-faint">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/admin/posts/${p.id}`} className="text-ink hover:text-indigo-bright">
                        {p.title}
                      </Link>
                    </td>
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
                    <td className="px-5 py-3 text-ink-faint">{formatDate(p.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
