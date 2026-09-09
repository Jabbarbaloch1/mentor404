import Link from "next/link";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) return null;

  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Coverage areas"
          title="Explore by domain"
          description="From dark web reconnaissance to daily threat digests — pick your lane."
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const IconComp = cat.icon
              ? ((Icons as unknown as Record<string, LucideIcon>)[cat.icon] ?? Icons.Folder)
              : Icons.Folder;
            const color = cat.color || "#5b5fef";

            return (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="glow-card group flex items-center gap-4 rounded-2xl p-5"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <IconComp size={20} />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-dim">
                    {cat._count.posts} {cat._count.posts === 1 ? "article" : "articles"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
