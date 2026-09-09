import { prisma } from "@/lib/prisma";
import { ResourceType } from "@prisma/client";
import ResourceCard from "@/components/ui/ResourceCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

export const metadata = {
  title: "Resources — Mentor404",
  description: "Curated cybersecurity tools, cheat sheets, and downloads.",
};

const TYPES: { label: string; value: ResourceType | "" }[] = [
  { label: "All", value: "" },
  { label: "Tools", value: "TOOL" },
  { label: "Cheat Sheets", value: "CHEATSHEET" },
  { label: "Downloads", value: "DOWNLOAD" },
  { label: "Links", value: "LINK" },
  { label: "Courses", value: "COURSE" },
];

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const validType = TYPES.find((t) => t.value === type)?.value || undefined;

  const resources = await prisma.resource.findMany({
    where: {
      published: true,
      type: validType || undefined,
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeader
        eyebrow="The toolkit"
        title="Resources"
        description="Hand-picked tools, cheat sheets, and downloads for offensive and defensive security work."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Link
            key={t.value}
            href={t.value ? `/resources?type=${t.value}` : "/resources"}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              (type || "") === t.value
                ? "border-indigo bg-indigo/15 text-indigo-bright"
                : "border-line text-ink-dim hover:border-line-bright"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {resources.length === 0 ? (
        <div className="glow-card mt-12 rounded-2xl p-12 text-center">
          <p className="font-mono-cyber text-ink-dim">no_resources_found()</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <ResourceCard key={r.slug} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}