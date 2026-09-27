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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    ),
  },
  {
    href: "/client/projects",
    label: "Projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 4v16" />
      </svg>
    ),
  },
  {
    href: "/client/messages",
    label: "Messages",
    badge: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.2 3.6A8 8 0 0 1 21 12z" />
      </svg>
    ),
  },
  {
    href: "/client/files",
    label: "Files",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
    ),
  },
  {
    href: "/client/invoices",
    label: "Invoices",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    href: "/client/feedback",
    label: "Feedback",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] flex-shrink-0 border-r"
      style={{
        background: "#0B0C11",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 0 16px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <img
            src="https://ik.imagekit.io/5xwchyocd7/potrailt.png"
            alt="ATB"
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#6B6F80" }}>
            ATB Visuals
          </p>
          <p className="text-sm font-bold text-white truncate">Client Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/client"
              ? pathname === "/client"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                color: isActive ? "#FFFFFF" : "#A0A3B1",
                background: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#A0A3B1";
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                  style={{
                    background: "#8B5CF6",
                    boxShadow: "0 0 12px rgba(139, 92, 246, 0.7)",
                  }}
                />
              )}

              <span style={{ color: isActive ? "#A78BFA" : "inherit" }}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>

              {item.badge && (
                <span
                  className="text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
                  style={{
                    background: "#8B5CF6",
                    color: "#FFFFFF",
                    boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Log out */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "#A0A3B1" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#A0A3B1";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}