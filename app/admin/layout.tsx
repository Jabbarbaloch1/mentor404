import { Toaster } from "react-hot-toast";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin — Mentor404",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg text-ink">
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
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
