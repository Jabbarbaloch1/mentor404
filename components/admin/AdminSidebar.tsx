"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Wrench,
  FlaskConical,
  Mail,
  FolderTree,
  LogOut,
  ExternalLink,
  Terminal,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Resources", href: "/admin/resources", icon: Wrench },
  { label: "Lab", href: "/admin/lab", icon: FlaskConical },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-bg-raised">
      <div className="flex items-center gap-2 border-b border-line px-6 py-5">
        <Terminal className="h-4 w-4 text-indigo" />
        <span className="font-display text-base font-semibold text-ink">
          mentor<span className="text-indigo">4</span>
          <span className="text-violet">0</span>
          <span className="text-indigo">4</span>
        </span>
        <span className="font-mono-cyber ml-auto text-[10px] text-ink-faint">
          admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {links.map((l) => {
          const active =
            l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-indigo/15 text-indigo-bright"
                  : "text-ink-dim hover:bg-bg-elevated hover:text-ink"
              }`}
            >
              <Icon size={16} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-dim hover:bg-bg-elevated hover:text-ink"
        >
          <ExternalLink size={16} />
          View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-dim hover:bg-bg-elevated hover:text-rose"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
