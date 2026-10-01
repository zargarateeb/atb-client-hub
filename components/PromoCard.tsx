"use client";

import { motion } from "framer-motion";

export default function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden h-full min-h-[360px] flex flex-col justify-end p-5 md:p-6 glass"
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1626908013351-800ddd734b8a?w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
        }}
      />

      {/* Purple overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(5, 2, 8, 0.75) 55%, rgba(5, 2, 8, 0.95) 100%)",
        }}
      />

      {/* Ambient purple glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          right: "-20%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(185, 139, 255, 0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <p
          className="label-caps mb-3"
          style={{ color: "#e3c8ff" }}
        >
          ● New Project
        </p>

        <h3
          className="text-editorial text-white mb-3"
          style={{
            fontSize: "clamp(1.4rem, 2vw, 1.6rem)",
          }}
        >
          Turn your ideas
          <br />
          into powerful visuals.
        </h3>

        <p
          className="tc text-[10px] mb-5"
          style={{ color: "#9a8fb0", letterSpacing: "0.15em" }}
        >
          MOTION · EDITS · BRAND
        </p>

        <button
          className="w-full py-3 rounded-xl font-bold text-[13px] transition-all cursor-pointer"
          style={{
            background: "#f6ecfb",
            color: "#050208",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 12px 32px rgba(185, 139, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f6ecfb";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)";
          }}
        >
          Start a New Project →
        </button>
      </div>
    </motion.div>
  );
}