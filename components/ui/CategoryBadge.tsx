import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

export default function CategoryBadge({
  name,
  color,
  icon,
  size = "sm",
}: {
  name: string;
  color?: string | null;
  icon?: string | null;
  size?: "sm" | "md";
}) {
  const IconComp = icon
    ? ((Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.Tag)
    : Icons.Tag;
  const c = color || "#5b5fef";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 font-medium ${
        size === "sm" ? "py-1 text-[11px]" : "py-1.5 text-xs"
      }`}
      style={{
        borderColor: `${c}40`,
        backgroundColor: `${c}14`,
        color: c,
      }}
    >
      <IconComp size={size === "sm" ? 11 : 13} />
      {name}
    </span>
  );
}
