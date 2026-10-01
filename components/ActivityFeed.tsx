"use client";

import { motion } from "framer-motion";

interface ActivityItem {
  type: "upload" | "video" | "edit" | "message" | "success";
  text: string;
  time: string;
}

const ACTIVITIES: ActivityItem[] = [
  { type: "upload", text: "You uploaded 3 files", time: "2H AGO" },
  { type: "video", text: "Ateeb sent a new edit (v2)", time: "5H AGO" },
  { type: "edit", text: 'Project "Swiggy Edit" moved to Editing', time: "YESTERDAY" },
  { type: "message", text: "You left feedback", time: "YESTERDAY" },
  { type: "success", text: "Invoice #004 marked as Paid", time: "3D AGO" },
];

const ICON_CONFIG = {
  upload: {
    bg: "rgba(185, 139, 255, 0.15)",
    color: "#e3c8ff",
    border: "rgba(185, 139, 255, 0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  video: {
    bg: "rgba(96, 165, 250, 0.15)",
    color: "#93c5fd",
    border: "rgba(96, 165, 250, 0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  edit: {
    bg: "rgba(251, 191, 36, 0.15)",
    color: "#fcd34d",
    border: "rgba(251, 191, 36, 0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  message: {
    bg: "rgba(74, 222, 128, 0.15)",
    color: "#86efac",
    border: "rgba(74, 222, 128, 0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  success: {
    bg: "rgba(74, 222, 128, 0.15)",
    color: "#86efac",
    border: "rgba(74, 222, 128, 0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

export default function ActivityFeed() {
  return (
    <div className="p-5 md:p-6 rounded-2xl glass">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#b98bff",
              boxShadow: "0 0 8px rgba(185, 139, 255, 0.7)",
            }}
          />
          <h3 className="font-bold text-white text-[15px]">Recent Activity</h3>
        </div>
        <button
          className="text-[11px] font-semibold transition-colors"
          style={{ color: "#b98bff" }}
        >
          View All →
        </button>
      </div>

      {/* Items with vertical connector */}
      <div className="relative flex flex-col gap-1">
        {/* Vertical connector line */}
        <div
          className="absolute left-[13px] top-2 bottom-2 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(185, 139, 255, 0.15) 0%, rgba(185, 139, 255, 0.05) 50%, transparent 100%)",
          }}
        />

        {ACTIVITIES.map((item, i) => {
          const config = ICON_CONFIG[item.type];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer z-10"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(185, 139, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10"
                style={{
                  background: config.bg,
                  color: config.color,
                  border: `1px solid ${config.border}`,
                  boxShadow: `0 0 12px ${config.color}22`,
                }}
              >
                {config.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] text-white leading-snug mb-0.5"
                  style={{ fontWeight: 500 }}
                >
                  {item.text}
                </p>
                <p
                  className="tc text-[10px]"
                  style={{ color: "#6a5f7c", letterSpacing: "0.08em" }}
                >
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