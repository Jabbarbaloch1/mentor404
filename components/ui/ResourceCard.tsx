import Link from "next/link";
import * as Icons from "lucide-react";
import { LucideIcon, ExternalLink, Download } from "lucide-react";
import CategoryBadge from "./CategoryBadge";

const TYPE_LABEL: Record<string, string> = {
  TOOL: "Tool",
  CHEATSHEET: "Cheat Sheet",
  LINK: "Link",
  DOWNLOAD: "Download",
  COURSE: "Course",
};

export type ResourceCardData = {
  slug: string;
  title: string;
  description: string;
  type: string;
  url?: string | null;
  fileUrl?: string | null;
  icon?: string | null;
  category?: { name: string; slug: string; color?: string | null; icon?: string | null } | null;
};

export default function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const IconComp = resource.icon
    ? ((Icons as unknown as Record<string, LucideIcon>)[resource.icon] ?? Icons.Wrench)
    : Icons.Wrench;

  const externalHref = resource.url || resource.fileUrl;
  const isDownload = !!resource.fileUrl && !resource.url;

  return (
    <div className="glow-card flex flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/15 text-indigo-bright">
          <IconComp size={18} />
        </span>
        <span className="font-mono-cyber text-[10px] uppercase tracking-wide text-ink-faint">
          {TYPE_LABEL[resource.type] || resource.type}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-semibold text-ink">
        {resource.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-dim">
        {resource.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        {resource.category && (
          <CategoryBadge
            name={resource.category.name}
            color={resource.category.color}
            icon={resource.category.icon}
          />
        )}
        {externalHref && (
          <Link
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-indigo-bright hover:text-indigo"
          >
            {isDownload ? "Get" : "Visit"}
            {isDownload ? <Download size={12} /> : <ExternalLink size={12} />}
          </Link>
        )}
      </div>
    </div>
  );
}
