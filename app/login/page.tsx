"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PortfolioCards from "@/components/PortfolioCards";
import TrustedBy from "@/components/TrustedBy";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("magic-link", {
      email: email.toLowerCase(),
      token: "dev-token",
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/client");
    router.refresh();
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#08090D" }}
    >
      {/* Ambient purple glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "25%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-15%",
          right: "15%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109, 40, 217, 0.15) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 md:px-10 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow:
                "0 0 24px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <img
              src="https://ik.imagekit.io/5xwchyocd7/potrailt.png"
              alt="ATB"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase hidden sm:block"
            style={{ color: "#A0A3B1" }}
          >
            Client Portal
          </p>
        </div>
        <TrustedBy />
      </div>

      {/* Floating portfolio cards */}
      <PortfolioCards />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 min-h-[calc(100vh-88px)] pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl text-center relative z-20"
        >
          {/* Brand label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[11px] font-semibold uppercase mb-8"
            style={{ color: "#8B5CF6", letterSpacing: "0.4em" }}
          >
            Client Portal
          </motion.p>

          {/* BIG BRAND */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-black text-white mb-10"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: "0.95",
              textShadow:
                "0 0 60px rgba(139, 92, 246, 0.3), 0 0 120px rgba(139, 92, 246, 0.15)",
            }}
          >
            ATB{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Visuals
            </span>
          </motion.h1>

          {/* Welcome back subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-xl md:text-2xl font-bold text-white mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Welcome back.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm md:text-[15px] leading-relaxed mb-14"
            style={{
              color: "#A0A3B1",
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            Access your projects, chat with Ateeb, review edits, and stay
            updated — all in one place.
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 max-w-md mx-auto"
          >
            <div className="relative">
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#6B6F80" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-4 h-4"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 6 10-6" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbrand.com"
                className="w-full pl-11 pr-4 py-4 rounded-xl text-sm transition-all"
                style={{
                  background: "rgba(17, 19, 26, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(10px)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  e.target.style.background = "rgba(17, 19, 26, 0.95)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(17, 19, 26, 0.85)";
                }}
              />
            </div>

            {error && (
              <div
                className="text-xs py-3 px-4 rounded-xl text-left"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-4 rounded-xl text-white font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              style={{
                background:
                  "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
                boxShadow:
                  "0 8px 32px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset, inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              {loading ? "Logging in..." : "Log In →"}
            </motion.button>
          </motion.form>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="text-[11px] mt-12"
            style={{ color: "#4A4D5C" }}
          >
            Client access only. Contact Ateeb for an account.
          </motion.p>
        </motion.div>
      </div>

      {/* Big handwritten signature — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute hidden lg:block z-20"
        style={{
          left: "56px",
          bottom: "56px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-caveat), cursive",
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
            transform: "rotate(-4deg)",
            fontSize: "clamp(2rem, 3vw, 2.75rem)",
            lineHeight: "0.95",
            fontWeight: 700,
          }}
        >
          Let&apos;s
          <br />
          Create
          <br />
          Something
          <br />
          Amazing.
        </p>
      </motion.div>

      {/* Studio background — bottom */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-0"
        style={{
          height: "50%",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 70%",
          opacity: 0.28,
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-0"
        style={{
          height: "50%",
          background:
            "linear-gradient(to top, rgba(109, 40, 217, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Footer branding — bottom right */}
      <div
        className="absolute bottom-6 right-8 text-[10px] hidden md:block z-20"
        style={{ color: "#4A4D5C", letterSpacing: "0.1em" }}
      >
        ATB VISUALS · CLIENT HUB v1
      </div>
    </div>
  );
}