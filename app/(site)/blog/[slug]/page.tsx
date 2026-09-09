import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import PostCard from "@/components/ui/PostCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.metaTitle || `${post.title} — Mentor404`,
    description: post.metaDescription || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { name: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  // Fire-and-forget view increment
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      categoryId: post.categoryId || undefined,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      {post.category && (
        <CategoryBadge name={post.category.name} color={post.category.color} icon={post.category.icon} size="md" />
      )}

      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-faint">
        {post.author?.name && <span>By {post.author.name}</span>}
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        {post.readTimeMin && (
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {post.readTimeMin} min read
          </span>
        )}
        <span className="flex items-center gap-1">
          <Eye size={13} />
          {post.views} views
        </span>
      </div>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div
        className="prose-cyber prose prose-invert mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
          {post.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="font-mono-cyber rounded-full bg-bg-elevated px-3 py-1 text-xs text-ink-dim"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Related articles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
