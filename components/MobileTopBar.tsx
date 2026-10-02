"use client";

import { signOut } from "next-auth/react";

interface MobileTopBarProps {
  userName: string;
  onOpenDrawer: () => void;
}

export default function MobileTopBar({ userName, onOpenDrawer }: MobileTopBarProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header
      className="md:hidden flex items-center justify-between px-4 h-14 border-b sticky top-0 z-30 flex-shrink-0"
      style={{
        background: "rgba(10, 5, 18, 0.85)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        borderColor: "rgba(185, 139, 255, 0.14)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
            boxShadow: "0 0 16px rgba(185, 139, 255, 0.4)",
          }}
        >
          <img
            src="https://ik.imagekit.io/5xwchyocd7/ATB-logo.png"
            alt="ATB"
            className="w-full h-full object-contain p-1.5"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-white leading-tight truncate">
            Client Hub
          </p>
          <p
            className="tc text-[9px] leading-tight"
            style={{ color: "#6a5f7c" }}
          >
            ATB VISUALS
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Sign out button — direct */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255, 155, 176, 0.08)",
            color: "#ff9bb0",
            border: "1px solid rgba(255, 155, 176, 0.25)",
          }}
          aria-label="Sign out"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>

        {/* Profile button — opens drawer */}
        <button
          onClick={onOpenDrawer}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
            color: "#1c0a33",
            boxShadow: "0 0 12px rgba(185, 139, 255, 0.4)",
          }}
          aria-label="Open menu"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}