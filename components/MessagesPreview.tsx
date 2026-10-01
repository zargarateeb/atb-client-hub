"use client";

import { motion } from "framer-motion";

interface Message {
  sender: string;
  text: string;
  time: string;
  avatar: string;
  unread?: boolean;
  isYou?: boolean;
}

const MESSAGES: Message[] = [
  {
    sender: "Ateeb",
    text: "Here's the updated edit. Let me know what you think...",
    time: "2H AGO",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    unread: true,
  },
  {
    sender: "You",
    text: "Looks great! Can we change the text on the second frame...",
    time: "5H AGO",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    isYou: true,
  },
  {
    sender: "Ateeb",
    text: "Sure, I'll update and send again today.",
    time: "1D AGO",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
];

export default function MessagesPreview() {
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
        <button
          className="text-[11px] font-semibold transition-colors"
          style={{ color: "#b98bff" }}
        >
          View All →
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-1">
        {MESSAGES.map((msg, i) => (
          <motion.div
            key={i}
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
            {/* Avatar with ring if unread */}
            <div className="relative flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full overflow-hidden"
                style={{
                  border: msg.unread
                    ? "1.5px solid #b98bff"
                    : "1.5px solid rgba(185, 139, 255, 0.15)",
                  boxShadow: msg.unread
                    ? "0 0 16px rgba(185, 139, 255, 0.4)"
                    : "none",
                }}
              >
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-full h-full object-cover"
                />
              </div>
              {msg.unread && (
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

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p
                  className="text-[13px] font-bold truncate"
                  style={{
                    color: msg.isYou ? "#9a8fb0" : "#f6ecfb",
                  }}
                >
                  {msg.sender}
                </p>
                <p
                  className="tc text-[9px] flex-shrink-0"
                  style={{ color: "#6a5f7c", letterSpacing: "0.08em" }}
                >
                  {msg.time}
                </p>
              </div>
              <p
                className="text-[12px] leading-snug truncate"
                style={{
                  color: msg.unread ? "#e3c8ff" : "#6a5f7c",
                  fontWeight: msg.unread ? 500 : 400,
                }}
              >
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}