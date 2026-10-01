"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  trend,
  icon,
  iconBg,
  iconColor,
  accent,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="relative p-4 md:p-5 rounded-2xl glass glass-hover group cursor-pointer overflow-hidden"
    >
      {/* Corner accent glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accent || "rgba(185, 139, 255, 0.35)"} 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Top row: label + icon */}
      <div className="relative flex items-start justify-between mb-4">
        <p
          className="label-caps"
          style={{ color: "#6a5f7c" }}
        >
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{
            background: iconBg,
            color: iconColor,
            boxShadow: `0 0 20px ${iconColor}22, inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Number */}
      <div className="relative flex items-end justify-between">
        <p
          className="text-editorial text-white leading-none"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
          }}
        >
          {value}
        </p>

        <div className="flex items-center gap-2 mb-1">
          {trend && (
            <span
              className="tc text-[11px] font-semibold flex items-center gap-0.5"
              style={{ color: "#4ade80" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                <path d="M7 17L17 7M17 7H8M17 7v9" />
              </svg>
              {trend}
            </span>
          )}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "#b98bff" }}
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}