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
    bg: "rgba(185, 139, 255, 0.15)",
    color: "#e3c8ff",
    border: "rgba(185, 139, 255, 0.35)",
    dot: "#b98bff",
  },
  "In Review": {
    bg: "rgba(96, 165, 250, 0.15)",
    color: "#93c5fd",
    border: "rgba(96, 165, 250, 0.35)",
    dot: "#60a5fa",
  },
  Finalizing: {
    bg: "rgba(74, 222, 128, 0.15)",
    color: "#86efac",
    border: "rgba(74, 222, 128, 0.35)",
    dot: "#4ade80",
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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group relative flex items-center gap-3 md:gap-4 p-3 rounded-2xl glass glass-hover cursor-pointer overflow-hidden"
    >
      {/* Left accent line on hover */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "#b98bff",
          boxShadow: "0 0 12px rgba(185, 139, 255, 0.7)",
        }}
      />

      {/* Thumbnail with mini timeline overlay */}
      <div
        className="relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0"
        style={{ background: "#0a0512" }}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(185, 139, 255, 0.25) 0%, rgba(5, 2, 8, 0.5) 100%)",
          }}
        />

        {/* Mini timeline strip at bottom of thumbnail */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 h-[3px] flex gap-[2px]">
          {[18, 26, 14, 22].map((w, i) => (
            <div
              key={i}
              className="h-full rounded-sm"
              style={{
                width: `${w}%`,
                background:
                  i % 2 === 0
                    ? "rgba(227, 200, 255, 0.85)"
                    : "rgba(185, 139, 255, 0.6)",
                boxShadow: "0 0 4px rgba(185, 139, 255, 0.5)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Middle: title + progress + status + deadline */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-[13px] md:text-sm truncate mb-2">
          {title}
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(255, 255, 255, 0.06)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: "linear-gradient(90deg, #8b5cf6 0%, #b98bff 50%, #e3c8ff 100%)",
                boxShadow: "0 0 8px rgba(185, 139, 255, 0.6)",
              }}
            >
              {/* Shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.5 }}
                className="absolute inset-0 w-1/2"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                }}
              />
            </motion.div>
          </div>
          <p
            className="tc text-[10px] font-bold flex-shrink-0"
            style={{ color: "#e3c8ff" }}
          >
            {progress}%
          </p>
        </div>

        {/* Status + deadline */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: statusStyle.dot,
                boxShadow: `0 0 6px ${statusStyle.dot}`,
              }}
            />
            {status}
          </span>
          <span
            className="tc text-[10px] flex items-center gap-1"
            style={{ color: "#6a5f7c" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {deadline}
          </span>
        </div>
      </div>

      {/* Right: avatars + menu */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:flex -space-x-2">
          {avatars.slice(0, 3).map((url, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full overflow-hidden"
              style={{
                border: "2px solid rgba(15, 8, 25, 0.9)",
                boxShadow: "0 0 8px rgba(185, 139, 255, 0.2)",
              }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {extraCount && extraCount > 0 && (
            <div
              className="tc w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{
                background: "rgba(21, 14, 38, 0.95)",
                border: "2px solid rgba(15, 8, 25, 0.9)",
                color: "#9a8fb0",
              }}
            >
              +{extraCount}
            </div>
          )}
        </div>

        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ color: "#6a5f7c" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e3c8ff";
            e.currentTarget.style.background = "rgba(185, 139, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6a5f7c";
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