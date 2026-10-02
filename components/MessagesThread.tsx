"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface Message {
  _id: string;
  text: string;
  senderRole: "client" | "admin";
  senderId: { name: string; email: string } | string;
  createdAt: string;
}

interface MessagesThreadProps {
  projectId: string;
}

export default function MessagesThread({ projectId }: MessagesThreadProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?projectId=${projectId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, text }),
      });
      const data = await res.json();
      if (data.success) {
        setText("");
        fetchMessages();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="flex flex-col rounded-2xl glass overflow-hidden"
      style={{ height: "600px" }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs" style={{ color: "#6a5f7c" }}>
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn =
              msg.senderRole === (session?.user as { role?: string })?.role;
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-2xl"
                  style={{
                    background: isOwn
                      ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                      : "rgba(185, 139, 255, 0.08)",
                    color: isOwn ? "#ffffff" : "#f6ecfb",
                    border: isOwn
                      ? "none"
                      : "1px solid rgba(185, 139, 255, 0.15)",
                  }}
                >
                  <p className="text-[13px] leading-snug whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <p
                    className="tc text-[9px] mt-1"
                    style={{
                      color: isOwn ? "rgba(255,255,255,0.7)" : "#6a5f7c",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t flex items-center gap-2 flex-shrink-0"
        style={{ borderColor: "rgba(185, 139, 255, 0.14)" }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3.5 py-2.5 rounded-lg text-sm"
          style={{
            background: "rgba(15, 8, 25, 0.7)",
            border: "1px solid rgba(185, 139, 255, 0.15)",
            color: "#f6ecfb",
          }}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-4 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #e3c8ff, #b98bff)",
            color: "#1c0a33",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}