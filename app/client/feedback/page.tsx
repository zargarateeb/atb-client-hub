"use client";

export default function FeedbackPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
          style={{ color: "#8B5CF6" }}
        >
          Collaboration
        </p>
        <h1
          className="font-black text-white mb-2"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Feedback
        </h1>
        <p className="text-sm" style={{ color: "#A0A3B1" }}>
          Leave timecoded comments, revision requests, and approvals.
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="font-bold text-white text-lg mb-2">
          Feedback threads coming soon
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "#6B6F80" }}>
          Timecoded video feedback, revision threads, and approval flows. Coming
          in Phase 2.
        </p>
      </div>
    </div>
  );
}