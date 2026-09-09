"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, []);

  async function toggleRead(id: string, read: boolean) {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, read } : x)));
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((m) => m.filter((x) => x.id !== id));
      toast.success("Message deleted.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Messages</h1>
        <p className="mt-1 text-sm text-ink-dim">Contact form submissions.</p>
      </div>

      {loading ? (
        <p className="text-sm text-ink-dim">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="glow-card rounded-2xl p-8 text-center text-sm text-ink-dim">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="glow-card rounded-2xl p-5">
              <div
                className="flex cursor-pointer items-start justify-between gap-4"
                onClick={() => {
                  setExpanded(expanded === m.id ? null : m.id);
                  if (!m.read) toggleRead(m.id, true);
                }}
              >
                <div className="flex items-start gap-3">
                  {m.read ? (
                    <MailOpen size={16} className="mt-1 text-ink-faint" />
                  ) : (
                    <Mail size={16} className="mt-1 text-indigo-bright" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${m.read ? "text-ink-dim" : "text-ink"}`}>
                      {m.subject || "No subject"}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {m.name} · {m.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-faint">{formatDate(m.createdAt)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(m.id);
                    }}
                    className="rounded-md p-1.5 text-ink-dim hover:bg-bg-elevated hover:text-rose"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {expanded === m.id && (
                <p className="mt-4 whitespace-pre-wrap border-t border-line pt-4 text-sm text-ink-dim">
                  {m.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
