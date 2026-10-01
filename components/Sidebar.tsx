"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

interface SidebarProps {
  userName: string;
}

const NAV_ITEMS = [
  {
    href: "/client",
    label: "Home",
    code: "00",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    ),
  },
  {
    href: "/client/projects",
    label: "Projects",
    code: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 4v16" />
      </svg>
    ),
  },
  {
    href: "/client/messages",
    label: "Messages",
    code: "02",
    badge: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
        <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.2 3.6A8 8 0 0 1 21 12z" />
      </svg>
    ),
  },
  {
    href: "/client/files",
    label: "Files",
    code: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
    ),
  },
  {
    href: "/client/invoices",
    label: "Invoices",
    code: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    href: "/client/feedback",
    label: "Feedback",
    code: "05",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] flex-shrink-0 relative z-20"
      style={{
        background: "rgba(10, 5, 18, 0.7)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        borderRight: "1px solid rgba(185, 139, 255, 0.14)",
      }}
    >
      {/* ============ EDITOR CHROME / TITLEBAR ============ */}
      <div
        className="flex items-center gap-2 px-4 h-11 border-b"
        style={{ borderColor: "rgba(185, 139, 255, 0.14)" }}
      >
        {/* Mac-style dots */}
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255, 137, 108, 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255, 200, 100, 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(120, 220, 150, 0.7)" }} />
        </div>
      </div>

      {/* ============ BRAND ============ */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
              boxShadow:
                "0 0 20px rgba(185, 139, 255, 0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <img
              src="https://ik.imagekit.io/5xwchyocd7/ATB-logo.png"
              alt="ATB"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-[9px] font-semibold uppercase"
              style={{ color: "#6a5f7c", letterSpacing: "0.22em" }}
            >
              ATB Visuals
            </p>
            <p className="text-[15px] font-bold text-white truncate leading-tight">
              Client Hub
            </p>
          </div>
        </div>

        {/* Version tag */}
        <div className="flex items-center gap-2 mt-4">
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded"
            style={{
              background: "rgba(185, 139, 255, 0.15)",
              color: "#b98bff",
              letterSpacing: "0.1em",
            }}
          >
            v1.0
          </span>
          <span
            className="text-[9px] tc"
            style={{ color: "#4a4155" }}
          >
            SECURE SESSION
          </span>
        </div>
      </div>

      {/* ============ NAVIGATION ============ */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {/* Section label */}
        <p
          className="text-[9px] font-semibold uppercase px-3 mb-2"
          style={{ color: "#4a4155", letterSpacing: "0.22em" }}
        >
          Workspace
        </p>

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/client"
              ? pathname === "/client"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group"
              style={{
                color: isActive ? "#f6ecfb" : "#9a8fb0",
                background: isActive ? "rgba(185, 139, 255, 0.12)" : "transparent",
                border: isActive ? "1px solid rgba(185, 139, 255, 0.2)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(185, 139, 255, 0.05)";
                  e.currentTarget.style.color = "#f6ecfb";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9a8fb0";
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{
                    background: "#b98bff",
                    boxShadow: "0 0 12px rgba(185, 139, 255, 0.8)",
                  }}
                />
              )}

              <span style={{ color: isActive ? "#e3c8ff" : "inherit" }}>
                {item.icon}
              </span>

              <span className="flex-1">{item.label}</span>

              {/* Code number */}
              <span
                className="tc text-[10px] font-medium"
                style={{ color: isActive ? "#b98bff" : "#4a4155" }}
              >
                {item.code}
              </span>

              {/* Badge */}
              {item.badge && (
                <span
                  className="text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                  style={{
                    background: "#b98bff",
                    color: "#1c0a33",
                    boxShadow: "0 0 10px rgba(185, 139, 255, 0.6)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ============ SIGNATURE ============ */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(185, 139, 255, 0.14)" }}>
        <p
          className="text-[11px] mb-3"
          style={{
            fontFamily: "var(--font-script), cursive",
            color: "rgba(255,255,255,0.75)",
            transform: "rotate(-3deg)",
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          Let&apos;s Create
          <br />
          Something Amazing.
        </p>

        {/* Log out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all"
          style={{ color: "#9a8fb0" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 155, 176, 0.08)";
            e.currentTarget.style.color = "#ff9bb0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9a8fb0";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}