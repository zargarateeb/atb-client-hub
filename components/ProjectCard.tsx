"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  thumbnail: string;
  progress: number;
  status: "Editing" | "In Review" | "Finalizing";
  deadline: string;
  avatars: string[];
  extraCount?: number;
}

const STATUS_STYLES = {
  Editing: {
    bg: "rgba(139, 92, 246, 0.15)",
    color: "#A78BFA",
  },
  "In Review": {
    bg: "rgba(59, 130, 246, 0.15)",
    color: "#60A5FA",
  },
  Finalizing: {
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34D399",
  },
};

export default function ProjectCard({
  title,
  thumbnail,
  progress,
  status,
  deadline,
  avatars,
  extraCount,
}: ProjectCardProps) {
  const statusStyle = STATUS_STYLES[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer"
      style={{
        background: "#11131A",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#171923";
        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
        e.currentTarget.style.boxShadow =
          "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#11131A";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
        style={{ background: "#0B0C11" }}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(8,9,13,0.4) 100%)",
          }}
        />
      </div>

      {/* Middle: title + progress + status + deadline */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate mb-2">{title}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex-1 h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #A78BFA)",
                boxShadow: "0 0 8px rgba(139,92,246,0.5)",
              }}
            />
          </div>
          <p
            className="text-[11px] font-bold flex-shrink-0"
            style={{ color: "#A78BFA" }}
          >
            {progress}%
          </p>
        </div>

        {/* Status + deadline */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {status}
          </span>
          <span
            className="text-[11px] flex items-center gap-1"
            style={{ color: "#6B6F80" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3 h-3"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            Due {deadline}
          </span>
        </div>
      </div>

      {/* Right: avatars + menu */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:flex -space-x-2">
          {avatars.slice(0, 3).map((url, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full overflow-hidden"
              style={{ border: "2px solid #11131A" }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {extraCount && extraCount > 0 && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{
                background: "#1A1D28",
                border: "2px solid #11131A",
                color: "#A0A3B1",
              }}
            >
              +{extraCount}
            </div>
          )}
        </div>

        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "#6B6F80" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6B6F80";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}