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
    time: "2h ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    unread: true,
  },
  {
    sender: "You",
    text: "Looks great! Can we change the text on the second frame...",
    time: "5h ago",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    isYou: true,
  },
  {
    sender: "Ateeb",
    text: "Sure, I'll update and send again today.",
    time: "1d ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
];

export default function MessagesPreview() {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "#11131A",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-white text-base">Latest Messages</h3>
        <button
          className="text-xs font-semibold transition-colors"
          style={{ color: "#A78BFA" }}
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
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 relative"
              style={{ border: "2px solid #11131A" }}
            >
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-full h-full object-cover"
              />
              {msg.unread && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "#8B5CF6",
                    border: "2px solid #11131A",
                    boxShadow: "0 0 8px rgba(139,92,246,0.7)",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p
                  className="text-sm font-semibold truncate"
                  style={{
                    color: msg.isYou ? "#A0A3B1" : "#FFFFFF",
                  }}
                >
                  {msg.sender}
                </p>
                <p
                  className="text-[10px] flex-shrink-0"
                  style={{ color: "#6B6F80" }}
                >
                  {msg.time}
                </p>
              </div>
              <p
                className="text-xs leading-snug truncate"
                style={{
                  color: msg.unread ? "#A0A3B1" : "#6B6F80",
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