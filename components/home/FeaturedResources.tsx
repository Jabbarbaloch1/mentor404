import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ResourceCard from "@/components/ui/ResourceCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function FeaturedResources() {
  const resources = await prisma.resource.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { category: true },
  });

  if (resources.length === 0) return null;

  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Hand-picked"
            title="Featured resources"
            description="Tools, cheat sheets, and links worth bookmarking."
          />
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-bright hover:text-indigo"
          >
            All resources
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <ResourceCard key={r.slug} resource={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
