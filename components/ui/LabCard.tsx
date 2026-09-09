import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { formatDate } from "@/lib/utils";

const DIFFICULTY_COLOR: Record<string, string> = {
  BEGINNER: "#34d399",
  INTERMEDIATE: "#f59e0b",
  ADVANCED: "#fb7185",
};

const DOMAIN_LABEL: Record<string, string> = {
  WEB: "Web",
  NETWORK: "Network",
  MALWARE: "Malware",
  FORENSICS: "Forensics",
  CLOUD: "Cloud",
  MOBILE: "Mobile",
  OSINT: "OSINT",
  OTHER: "Other",
};

export type LabCardData = {
  slug: string;
  title: string;
  summary?: string | null;
  domain: string;
  difficulty: string;
  toolsUsed: string[];
  createdAt: Date | string;
};

export default function LabCard({ entry }: { entry: LabCardData }) {
  const diffColor = DIFFICULTY_COLOR[entry.difficulty] || "#5b5fef";

  return (
    <Link
      href={`/lab/${entry.slug}`}
      className="glow-card group flex flex-col rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-bg-elevated px-2.5 py-1 text-[11px] text-ink-dim">
          <FlaskConical size={11} />
          {DOMAIN_LABEL[entry.domain] || entry.domain}
        </span>
        <span
          className="text-[11px] font-medium"
          style={{ color: diffColor }}
        >
          {entry.difficulty.charAt(0) + entry.difficulty.slice(1).toLowerCase()}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-semibold text-ink transition-colors group-hover:text-indigo-bright">
        {entry.title}
      </h3>
      {entry.summary && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-dim">
          {entry.summary}
        </p>
      )}

      {entry.toolsUsed?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.toolsUsed.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono-cyber rounded bg-bg-elevated px-2 py-0.5 text-[10px] text-ink-dim"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-faint">{formatDate(entry.createdAt)}</p>
    </Link>
  );
}
