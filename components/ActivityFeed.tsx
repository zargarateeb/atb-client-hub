"use client";

import { motion } from "framer-motion";

interface ActivityItem {
  type: "upload" | "video" | "edit" | "message" | "success";
  text: string;
  time: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    type: "upload",
    text: "You uploaded 3 files",
    time: "2 hours ago",
  },
  {
    type: "video",
    text: "Ateeb sent a new edit (v2)",
    time: "5 hours ago",
  },
  {
    type: "edit",
    text: 'Project "Swiggy Edit" moved to Editing',
    time: "Yesterday",
  },
  {
    type: "message",
    text: "You left feedback",
    time: "Yesterday",
  },
  {
    type: "success",
    text: "Invoice #004 marked as Paid",
    time: "3 days ago",
  },
];

const ICON_CONFIG = {
  upload: {
    bg: "rgba(139, 92, 246, 0.15)",
    color: "#A78BFA",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  video: {
    bg: "rgba(59, 130, 246, 0.15)",
    color: "#60A5FA",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  edit: {
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#FBBF24",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  message: {
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34D399",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  success: {
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34D399",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

export default function ActivityFeed() {
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
        <h3 className="font-bold text-white text-base">Recent Activity</h3>
        <button
          className="text-xs font-semibold transition-colors"
          style={{ color: "#A78BFA" }}
        >
          View All →
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1">
        {ACTIVITIES.map((item, i) => {
          const config = ICON_CONFIG[item.type];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
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
              {/* Icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: config.bg,
                  color: config.color,
                }}
              >
                {config.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm text-white leading-snug mb-0.5"
                  style={{ fontWeight: 500 }}
                >
                  {item.text}
                </p>
                <p className="text-[11px]" style={{ color: "#6B6F80" }}>
                  {item.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}