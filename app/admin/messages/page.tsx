"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MessagesThread from "@/components/MessagesThread";

interface Thread {
  project: { _id: string; title: string; status: string };
  client: { _id: string; name: string; email: string };
  latestMessage: {
    text: string;
    senderRole: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    const res = await fetch("/api/admin/messages", { cache: "no-store" });
    const data = await res.json();
    if (data.success) {
      setThreads(data.threads);
      if (!selected && data.threads.length > 0) {
        setSelected(data.threads[0].project._id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">
      <div className="mb-6">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Inbox
        </p>
        <h1 className="text-editorial text-white text-2xl">All Messages</h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Chat with all your clients in one place.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#6a5f7c" }}>
            Loading...
          </p>
        </div>
      ) : threads.length === 0 ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#9a8fb0" }}>
            No active conversations yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
          {/* Threads list */}
          <div className="flex flex-col gap-2">
            {threads.map((t) => {
              const isActive = selected === t.project._id;
              return (
                <motion.button
                  key={t.project._id}
                  onClick={() => setSelected(t.project._id)}
                  whileHover={{ x: 2 }}
                  className="text-left p-3 rounded-xl glass transition-all"
                  style={{
                    background: isActive
                      ? "rgba(185, 139, 255, 0.15)"
                      : undefined,
                    border: isActive
                      ? "1px solid rgba(185, 139, 255, 0.4)"
                      : "1px solid rgba(185, 139, 255, 0.16)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[13px] font-bold text-white truncate">
                      {t.client?.name || "Unknown"}
                    </p>
                    {t.unreadCount > 0 && (
                      <span
                        className="tc text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "#b98bff",
                          color: "#1c0a33",
                          boxShadow: "0 0 8px rgba(185, 139, 255, 0.6)",
                        }}
                      >
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-[11px] truncate mb-1.5"
                    style={{ color: "#9a8fb0" }}
                  >
                    {t.project.title}
                  </p>
                  {t.latestMessage && (
                    <p
                      className="text-[11px] truncate"
                      style={{ color: "#6a5f7c" }}
                    >
                      {t.latestMessage.senderRole === "admin" && "You: "}
                      {t.latestMessage.text}
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Thread view */}
          <div>
            {selected ? (
              <MessagesThread projectId={selected} />
            ) : (
              <div className="p-12 text-center glass rounded-2xl">
                <p className="text-sm" style={{ color: "#6a5f7c" }}>
                  Select a conversation
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}