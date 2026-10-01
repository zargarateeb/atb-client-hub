"use client";

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
        {/* Notification */}
        <button
          className="relative w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(15, 8, 25, 0.7)", color: "#9a8fb0" }}
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" />
            <path d="M10 21a2 2 0 0 0 4 0" />
          </svg>
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{
              background: "#ff9bb0",
              boxShadow: "0 0 6px rgba(255, 155, 176, 0.8)",
            }}
          />
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