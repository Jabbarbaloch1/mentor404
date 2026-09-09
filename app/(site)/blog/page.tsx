import { prisma } from "@/lib/prisma";
import PostCard from "@/components/ui/PostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

export const metadata = {
  title: "Blog — Mentor404",
  description: "Cybersecurity write-ups, dark web intel, tools, and daily threat digests.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        category: category ? { slug: category } : undefined,
        title: q ? { contains: q, mode: "insensitive" } : undefined,
      },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeader
        eyebrow="The feed"
        title="Blog & Articles"
        description="Dark web intel, offensive & defensive security, tools, and daily digests — written from the field."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !category
              ? "border-indigo bg-indigo/15 text-indigo-bright"
              : "border-line text-ink-dim hover:border-line-bright"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/blog?category=${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === c.slug
                ? "border-indigo bg-indigo/15 text-indigo-bright"
                : "border-line text-ink-dim hover:border-line-bright"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="glow-card mt-12 rounded-2xl p-12 text-center">
          <p className="font-mono-cyber text-ink-dim">
            no_results_found()
          </p>
          <p className="mt-2 text-sm text-ink-faint">
            {category
              ? "No published posts in this category yet."
              : "No posts published yet — check back soon."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
