"use client";

const AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
];

export default function TrustedBy() {
  return (
    <div className="flex items-center gap-3">
      <p
        className="text-[11px] hidden md:block"
        style={{ color: "#6B6F80" }}
      >
        Trusted by creators &amp; brands
      </p>

      <div className="flex -space-x-2">
        {AVATARS.map((url, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full overflow-hidden"
            style={{
              border: "2px solid #0B0C11",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            background: "#1A1D28",
            border: "2px solid #0B0C11",
            color: "#A0A3B1",
          }}
        >
          +20
        </div>
      </div>
    </div>
  );
}