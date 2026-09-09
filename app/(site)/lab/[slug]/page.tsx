import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Target, ShieldAlert, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const DIFFICULTY_COLOR: Record<string, string> = {
  BEGINNER: "#34d399",
  INTERMEDIATE: "#f59e0b",
  ADVANCED: "#fb7185",
};

const DOMAIN_LABEL: Record<string, string> = {
  WEB: "Web Application",
  NETWORK: "Network",
  MALWARE: "Malware Analysis",
  FORENSICS: "Forensics",
  CLOUD: "Cloud",
  MOBILE: "Mobile",
  OSINT: "OSINT",
  OTHER: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await prisma.labEntry.findUnique({ where: { slug } });
  if (!entry) return {};
  return {
    title: `${entry.title} — Mentor404 Lab`,
    description: entry.summary || undefined,
  };
}

export default async function LabEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const entry = await prisma.labEntry.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

  if (!entry || !entry.published) notFound();

  const diffColor = DIFFICULTY_COLOR[entry.difficulty] || "#5b5fef";
  const diffLabel = entry.difficulty.charAt(0) + entry.difficulty.slice(1).toLowerCase();
  const domainLabel = DOMAIN_LABEL[entry.domain] || entry.domain;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/lab" className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink">
        <ArrowLeft size={14} />
        Back to lab
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-bg-elevated px-3 py-1 text-xs text-ink-dim">
          <FlaskConical size={12} />
          {domainLabel}
        </span>
        <span
          className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
          style={{ borderColor: `${diffColor}40`, backgroundColor: `${diffColor}14`, color: diffColor }}
        >
          {diffLabel}
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        {entry.title}
      </h1>

      {entry.summary && (
        <p className="mt-3 text-base leading-relaxed text-ink-dim">{entry.summary}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-faint">
        {entry.author?.name && <span>By {entry.author.name}</span>}
        <span>{formatDate(entry.createdAt)}</span>
      </div>

      {/* Report brief — objective / impact / tools, laid out like a real assessment summary */}
      {(entry.objective || entry.impact || entry.toolsUsed.length > 0) && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-bg-raised">
          <div className="border-b border-line bg-bg-elevated px-5 py-3">
            <p className="font-mono-cyber text-[11px] uppercase tracking-widest text-indigo-bright">
              Assessment Brief
            </p>
          </div>
          <div className="divide-y divide-line">
            {entry.objective && (
              <div className="flex gap-3 px-5 py-4">
                <Target size={16} className="mt-0.5 shrink-0 text-indigo-bright" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                    Objective
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-dim">{entry.objective}</p>
                </div>
              </div>
            )}
            {entry.impact && (
              <div className="flex gap-3 px-5 py-4">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-rose" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                    Impact
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-dim">{entry.impact}</p>
                </div>
              </div>
            )}
            {entry.toolsUsed.length > 0 && (
              <div className="flex gap-3 px-5 py-4">
                <Wrench size={16} className="mt-0.5 shrink-0 text-cyan" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                    Tools used
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {entry.toolsUsed.map((t) => (
                      <span
                        key={t}
                        className="font-mono-cyber rounded bg-bg-elevated px-2 py-0.5 text-xs text-ink-dim"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="prose-cyber prose prose-invert mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />
    </article>
  );
}
