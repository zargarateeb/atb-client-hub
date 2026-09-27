"use client";

import { motion } from "framer-motion";

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-30"
      style={{
        background: "rgba(11, 12, 17, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Mobile: ATB logo */}
      <div className="flex md:hidden items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
          }}
        >
          <img
            src="https://ik.imagekit.io/5xwchyocd7/potrailt.png"
            alt="ATB"
            className="w-full h-full object-contain p-1"
          />
        </div>
        <p className="text-sm font-bold text-white">Client Hub</p>
      </div>

      {/* Desktop: Search */}
      <div className="hidden md:flex flex-1 max-w-lg relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#6B6F80" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects, files, or messages..."
          className="w-full pl-11 pr-16 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: "rgba(17, 19, 26, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#FFFFFF",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
            e.target.style.boxShadow = "none";
          }}
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#6B6F80",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          ⌘K
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Mobile search icon */}
        <button
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(17, 19, 26, 0.85)", color: "#A0A3B1" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(17, 19, 26, 0.85)", color: "#A0A3B1" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(23, 25, 35, 1)";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(17, 19, 26, 0.85)";
            e.currentTarget.style.color = "#A0A3B1";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" />
            <path d="M10 21a2 2 0 0 0 4 0" />
          </svg>
          {/* Red dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              background: "#EF4444",
              boxShadow: "0 0 6px rgba(239, 68, 68, 0.7)",
            }}
          />
        </button>

        {/* User dropdown */}
        <button
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl transition-colors"
          style={{ background: "rgba(17, 19, 26, 0.85)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(23, 25, 35, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(17, 19, 26, 0.85)";
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: "0 0 12px rgba(139, 92, 246, 0.3)",
            }}
          >
            {initial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {userName}
            </p>
            <p className="text-[10px] leading-tight" style={{ color: "#6B6F80" }}>
              Client
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5 hidden sm:block"
            style={{ color: "#6B6F80" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}