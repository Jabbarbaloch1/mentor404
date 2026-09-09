export const siteConfig = {
  name: "Mentor404",
  tagline: "Cybersecurity research, tools & lab write-ups",
  description:
    "A cybersecurity blog and lab covering dark web intel, offensive & defensive security, tools, and daily threat digests.",
  url: "https://mentor404.com",
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Lab", href: "/lab" },
  { label: "Contact", href: "/contact" },
];

export const categoryTheme: Record<
  string,
  { color: string; icon: string }
> = {
  "dark-web": { color: "#c084fc", icon: "Skull" },
  security: { color: "#5b5fef", icon: "ShieldAlert" },
  tools: { color: "#22d3ee", icon: "Wrench" },
  technology: { color: "#34d399", icon: "Cpu" },
  news: { color: "#f59e0b", icon: "Newspaper" },
  daily: { color: "#f472b6", icon: "CalendarClock" },
};
