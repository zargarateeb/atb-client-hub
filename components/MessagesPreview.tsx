"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Message {
  _id: string;
  text: string;
  senderRole: "client" | "admin";
  senderId: { name: string; email: string; role: string } | string;
  read: boolean;
  createdAt: string;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "JUST NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}D AGO`;
  return `${Math.floor(days / 7)}W AGO`;
}

export default function MessagesPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/client/recent-messages", { cache: "no-store" });
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 md:p-6 rounded-2xl glass">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#60a5fa",
              boxShadow: "0 0 8px rgba(96, 165, 250, 0.7)",
            }}
          />
          <h3 className="font-bold text-white text-[15px]">Latest Messages</h3>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-center py-8" style={{ color: "#6a5f7c" }}>
          Loading...
        </p>
      ) : messages.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm mb-1" style={{ color: "#9a8fb0" }}>
            No messages yet
          </p>
          <p className="tc text-[9px]" style={{ color: "#4a4155" }}>
            START A CONVERSATION FROM THE MESSAGES PAGE
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {messages.map((msg, i) => {
            const isYou = msg.senderRole === "client";
            const initials = isYou ? "Y" : "A";
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(185, 139, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Avatar with initials */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: isYou
                        ? "rgba(185, 139, 255, 0.15)"
                        : "linear-gradient(135deg, #e3c8ff, #b98bff, #8b5cf6)",
                      color: isYou ? "#e3c8ff" : "#1c0a33",
                      border: msg.read ? "1.5px solid rgba(185, 139, 255, 0.15)" : "1.5px solid #b98bff",
                      boxShadow: msg.read ? "none" : "0 0 16px rgba(185, 139, 255, 0.4)",
                    }}
                  >
                    {initials}
                  </div>
                  {!msg.read && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "#b98bff",
                        border: "2px solid #0d0718",
                        boxShadow: "0 0 8px rgba(185, 139, 255, 0.8)",
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p
                      className="text-[13px] font-bold truncate"
                      style={{ color: isYou ? "#9a8fb0" : "#f6ecfb" }}
                    >
                      {isYou ? "You" : "Ateeb"}
                    </p>
                    <p
                      className="tc text-[9px] flex-shrink-0"
                      style={{ color: "#6a5f7c", letterSpacing: "0.08em" }}
                    >
                      {formatTimeAgo(msg.createdAt)}
                    </p>
                  </div>
                  <p
                    className="text-[12px] leading-snug truncate"
                    style={{
                      color: !msg.read ? "#e3c8ff" : "#6a5f7c",
                      fontWeight: !msg.read ? 500 : 400,
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}