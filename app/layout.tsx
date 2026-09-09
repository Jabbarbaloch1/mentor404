import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mentor404.com"),
  title: {
    default: "Mentor404 — Cybersecurity Blog, Resources & Lab",
    template: "%s",
  },
  description:
    "A cybersecurity blog and lab covering dark web intel, offensive & defensive security, tools, and daily threat digests.",
  openGraph: {
    title: "Mentor404 — Cybersecurity Blog, Resources & Lab",
    description:
      "Dark web intel, offensive & defensive security, tools, and daily threat digests.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#181b27",
              color: "#f3f2ee",
              border: "1px solid #23263a",
              fontSize: "13px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
