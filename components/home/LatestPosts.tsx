import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/ui/PostCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function LatestPosts() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 5,
    include: { category: true },
  });

  if (posts.length === 0) return null;

  const [primary, ...rest] = posts;

  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Fresh from the feed"
            title="Latest articles"
            description="Hands-on write-ups and analysis across the security landscape."
          />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-bright hover:text-indigo"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6">
          <PostCard post={primary} featured />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
