"use client";

import { motion } from "framer-motion";

interface HeaderProps {
  userName: string;
}

function getTimecode(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function Header({ userName }: HeaderProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-14 border-b sticky top-0 z-30 flex-shrink-0"
      style={{
        background: "rgba(10, 5, 18, 0.7)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        borderColor: "rgba(185, 139, 255, 0.14)",
      }}
    >
      {/* LEFT — mobile brand + desktop session label */}
      <div className="flex items-center gap-3">
        {/* Mobile brand */}
        <div className="flex md:hidden items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
            }}
          >
            <img
              src="https://ik.imagekit.io/5xwchyocd7/ATB-logo.png"
              alt="ATB"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <p className="text-[13px] font-bold text-white">Client Hub</p>
        </div>

        {/* Desktop session indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#4ade80",
                boxShadow: "0 0 8px rgba(74, 222, 128, 0.7)",
              }}
            />
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ color: "#6a5f7c", letterSpacing: "0.2em" }}
            >
              Session Active
            </span>
          </div>
          <span
            className="tc text-[10px]"
            style={{ color: "#4a4155" }}
          >
            {getTimecode()}
          </span>
        </div>
      </div>

      {/* CENTER — search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#6a5f7c" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects, files, or messages..."
          className="w-full pl-10 pr-14 py-2 rounded-lg text-[13px] transition-all"
          style={{
            background: "rgba(15, 8, 25, 0.7)",
            border: "1px solid rgba(185, 139, 255, 0.12)",
            color: "#f6ecfb",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(185, 139, 255, 0.45)";
            e.target.style.boxShadow = "0 0 0 3px rgba(185, 139, 255, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(185, 139, 255, 0.12)";
            e.target.style.boxShadow = "none";
          }}
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 tc text-[10px] font-semibold px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(185, 139, 255, 0.08)",
            color: "#9a8fb0",
            border: "1px solid rgba(185, 139, 255, 0.12)",
          }}
        >
          ⌘K
        </div>
      </div>

      {/* RIGHT — actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(15, 8, 25, 0.7)", color: "#9a8fb0" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>

        {/* Notification */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(15, 8, 25, 0.7)", color: "#9a8fb0" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(21, 14, 38, 0.9)";
            e.currentTarget.style.color = "#e3c8ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(15, 8, 25, 0.7)";
            e.currentTarget.style.color = "#9a8fb0";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" />
            <path d="M10 21a2 2 0 0 0 4 0" />
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              background: "#ff9bb0",
              boxShadow: "0 0 6px rgba(255, 155, 176, 0.8)",
            }}
          />
        </button>

        {/* User dropdown */}
        <button
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "rgba(15, 8, 25, 0.7)",
            border: "1px solid rgba(185, 139, 255, 0.12)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(21, 14, 38, 0.9)";
            e.currentTarget.style.borderColor = "rgba(185, 139, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(15, 8, 25, 0.7)";
            e.currentTarget.style.borderColor = "rgba(185, 139, 255, 0.12)";
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
              color: "#1c0a33",
              boxShadow: "0 0 12px rgba(185, 139, 255, 0.35)",
            }}
          >
            {initial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-bold text-white leading-tight">
              {userName}
            </p>
            <p className="tc text-[9px] leading-tight" style={{ color: "#6a5f7c" }}>
              CLIENT
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3 h-3 hidden sm:block"
            style={{ color: "#6a5f7c" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}