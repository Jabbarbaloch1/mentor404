import slugify from "slugify";

export function makeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(date: Date | string) {
  const d = new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}

export function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}
