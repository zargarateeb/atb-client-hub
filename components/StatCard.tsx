"use client";

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  label,
  value,
  trend,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div
      className="relative p-5 rounded-2xl transition-all group cursor-pointer"
      style={{
        background: "#11131A",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#171923";
        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#11131A";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between mb-4">
        <p
          className="text-[10px] font-bold tracking-[0.12em] uppercase"
          style={{ color: "#6B6F80" }}
        >
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: iconBg,
            color: iconColor,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Number */}
      <div className="flex items-end justify-between">
        <p
          className="font-black text-white leading-none"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </p>

        <div className="flex items-center gap-2 mb-1">
          {trend && (
            <span
              className="text-[11px] font-semibold flex items-center gap-0.5"
              style={{ color: "#10B981" }}
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
            style={{ color: "#A78BFA" }}
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}