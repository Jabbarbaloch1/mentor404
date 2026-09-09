import { prisma } from "@/lib/prisma";
import { LabDomain } from "@prisma/client";
import LabCard from "@/components/ui/LabCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

export const metadata = {
  title: "Lab — Mentor404",
  description: "Hands-on write-ups from security testing and experiments.",
};

const DOMAINS: LabDomain[] = ["WEB", "NETWORK", "MALWARE", "FORENSICS", "CLOUD", "MOBILE", "OSINT", "OTHER"];

export default async function LabPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  const validDomain = DOMAINS.find((d) => d === domain);

  const entries = await prisma.labEntry.findMany({
    where: {
      published: true,
      domain: validDomain,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeader
        eyebrow="Hands-on"
        title="The Lab"
        description="Write-ups from real testing and experiments — web, network, malware, forensics, cloud, and more."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/lab"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !domain
              ? "border-indigo bg-indigo/15 text-indigo-bright"
              : "border-line text-ink-dim hover:border-line-bright"
          }`}
        >
          All
        </Link>
        {DOMAINS.map((d) => (
          <Link
            key={d}
            href={`/lab?domain=${d}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              domain === d
                ? "border-indigo bg-indigo/15 text-indigo-bright"
                : "border-line text-ink-dim hover:border-line-bright"
            }`}
          >
            {d.charAt(0) + d.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="glow-card mt-12 rounded-2xl p-12 text-center">
          <p className="font-mono-cyber text-ink-dim">lab_empty()</p>
          <p className="mt-2 text-sm text-ink-faint">No write-ups published in this domain yet.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <LabCard key={e.slug} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}