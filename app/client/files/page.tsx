"use client";

export default function FilesPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
          style={{ color: "#8B5CF6" }}
        >
          Storage
        </p>
        <h1
          className="font-black text-white mb-2"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Files
        </h1>
        <p className="text-sm" style={{ color: "#A0A3B1" }}>
          Upload raw footage, download deliverables, access project assets.
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
          style={{ background: "rgba(16, 185, 129, 0.12)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#34D399"
            strokeWidth="1.5"
            className="w-7 h-7"
          >
            <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <path d="M14 3v6h6" />
          </svg>
        </div>
        <h2 className="font-bold text-white text-lg mb-2">
          File sharing coming soon
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "#6B6F80" }}>
          Direct uploads, secure deliverables, and version history — all inside
          the hub. Coming in Phase 2.
        </p>
      </div>
    </div>
  );
}