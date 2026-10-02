"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Activity {
  _id: string;
  type: "file-uploaded" | "message-sent" | "status-changed" | "project-created" | "project-deleted";
  text: string;
  createdAt: string;
}

const ICON_CONFIG: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  "file-uploaded": {
    bg: "rgba(185, 139, 255, 0.15)",
    color: "#e3c8ff",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  "message-sent": {
    bg: "rgba(96, 165, 250, 0.15)",
    color: "#93c5fd",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  "status-changed": {
    bg: "rgba(251, 191, 36, 0.15)",
    color: "#fcd34d",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  "project-created": {
    bg: "rgba(74, 222, 128, 0.15)",
    color: "#86efac",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  "project-deleted": {
    bg: "rgba(255, 155, 176, 0.15)",
    color: "#ff9bb0",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
};

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
  const weeks = Math.floor(days / 7);
  return `${weeks}W AGO`;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/client/activity", { cache: "no-store" });
        const data = await res.json();
        if (data.success) setActivities(data.activities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
    const interval = setInterval(fetchActivity, 10000);
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
              background: "#b98bff",
              boxShadow: "0 0 8px rgba(185, 139, 255, 0.7)",
            }}
          />
          <h3 className="font-bold text-white text-[15px]">Recent Activity</h3>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-center py-8" style={{ color: "#6a5f7c" }}>
          Loading...
        </p>
      ) : activities.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm mb-1" style={{ color: "#9a8fb0" }}>
            No activity yet
          </p>
          <p className="tc text-[9px]" style={{ color: "#4a4155" }}>
            UPLOAD FILES OR SEND MESSAGES TO SEE EVENTS HERE
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-1">
          <div
            className="absolute left-[13px] top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgba(185, 139, 255, 0.15) 0%, rgba(185, 139, 255, 0.05) 50%, transparent 100%)",
            }}
          />
          {activities.map((activity, i) => {
            const config = ICON_CONFIG[activity.type] || ICON_CONFIG["message-sent"];
            return (
              <motion.div
                key={activity._id}
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
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10"
                  style={{
                    background: config.bg,
                    color: config.color,
                    boxShadow: `0 0 12px ${config.color}22`,
                  }}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white leading-snug mb-0.5" style={{ fontWeight: 500 }}>
                    {activity.text}
                  </p>
                  <p className="tc text-[10px]" style={{ color: "#6a5f7c", letterSpacing: "0.08em" }}>
                    {formatTimeAgo(activity.createdAt)}
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