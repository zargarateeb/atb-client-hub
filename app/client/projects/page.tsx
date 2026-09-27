"use client";

export default function ProjectsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
          style={{ color: "#8B5CF6" }}
        >
          Workspace
        </p>
        <h1
          className="font-black text-white mb-2"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Projects
        </h1>
        <p className="text-sm" style={{ color: "#A0A3B1" }}>
          All your projects with ATB Visuals — active, in review, and delivered.
        </p>
      </div>

      {/* Empty state */}
      <div
        className="p-16 rounded-3xl flex flex-col items-center text-center"
        style={{
          background: "#11131A",
          border: "1px dashed rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "rgba(139, 92, 246, 0.12)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="1.5"
            className="w-7 h-7"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 4v16" />
          </svg>
        </div>
        <h2 className="font-bold text-white text-lg mb-2">
          Full projects view coming soon
        </h2>
        <p
          className="text-sm max-w-sm"
          style={{ color: "#6B6F80" }}
        >
          This page will show every project you&apos;ve worked on with ATB
          Visuals, filterable by status, category, and date.
        </p>
      </div>
    </div>
  );
}