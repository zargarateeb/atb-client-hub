"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface BottomNavProps {
  onOpenDrawer: () => void;
  unreadMessages?: number;
}

const ITEMS = [
  {
    href: "/client",
    label: "Home",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    ),
  },
  {
    href: "/client/projects",
    label: "Projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 4v16" />
      </svg>
    ),
  },
  {
    href: "/client/messages",
    label: "Messages",
    badge: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
        <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.2 3.6A8 8 0 0 1 21 12z" />
      </svg>
    ),
  },
  {
    href: "/client/files",
    label: "Files",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
    ),
  },
  {
    href: "#more",
    label: "More",
    isMore: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="6" cy="12" r="1.5" fill="currentColor" />
        <circle cx="18" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav({ onOpenDrawer, unreadMessages = 2 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: "rgba(10, 5, 18, 0.9)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        borderColor: "rgba(185, 139, 255, 0.14)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {ITEMS.map((item) => {
          if (item.isMore) {
            return (
              <button
                key={item.href}
                onClick={onOpenDrawer}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
                style={{ color: "#6a5f7c" }}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full"
              style={{ color: isActive ? "#e3c8ff" : "#6a5f7c" }}
            >
              {/* Active indicator — subtle line above */}
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-b-full"
                  style={{
                    background: "#b98bff",
                    boxShadow: "0 0 12px rgba(185, 139, 255, 0.8)",
                  }}
                />
              )}

              <span className="relative">
                {item.icon}
                {item.badge && unreadMessages > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold px-1"
                    style={{
                      background: "#b98bff",
                      color: "#1c0a33",
                      boxShadow: "0 0 8px rgba(185, 139, 255, 0.7)",
                    }}
                  >
                    {unreadMessages}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}