"use client";

import { motion } from "framer-motion";

export default function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden h-full min-h-[400px] flex flex-col justify-end p-6"
      style={{ background: "#0B0C11" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1626908013351-800ddd734b8a?w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }}
      />

      {/* Purple overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, rgba(8, 9, 13, 0.75) 60%, rgba(8, 9, 13, 0.95) 100%)",
        }}
      />

      {/* Purple ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          right: "-20%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <p
          className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3"
          style={{ color: "#A78BFA" }}
        >
          New Project
        </p>

        <h3
          className="font-black text-white mb-4 leading-tight"
          style={{
            fontSize: "clamp(1.5rem, 2vw, 1.75rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Turn your ideas
          <br />
          into powerful visuals.
        </h3>

        <p className="text-xs mb-6" style={{ color: "#A0A3B1" }}>
          Motion Graphics · Edits · Brand Content
        </p>

        <button
          className="w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
          style={{
            background: "#FFFFFF",
            color: "#0C0A09",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F5F5F5";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
          }}
        >
          Start a New Project →
        </button>
      </div>
    </motion.div>
  );
}