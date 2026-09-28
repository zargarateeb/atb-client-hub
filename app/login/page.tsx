"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PortfolioCards from "@/components/PortfolioCards";

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
      style={{ background: "#05060A" }}
    >
      {/* Ambient purple glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          left: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          right: "-20%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109, 40, 217, 0.2) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      {/* ============ TOP: BRANDING ============ */}
      <div className="relative z-20 pt-8 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-black leading-none"
          style={{
            fontSize: "clamp(2.25rem, 10vw, 3.5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          <span
            className="text-white"
            style={{
              textShadow: "0 0 40px rgba(255,255,255,0.15)",
            }}
          >
            ATB{" "}
          </span>
          <span
            style={{
              background:
                "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 40%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 60px rgba(139, 92, 246, 0.6)",
              display: "inline-block",
            }}
          >
            Visuals
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[11px] md:text-xs font-semibold mt-3"
          style={{
            color: "#FFFFFF",
            letterSpacing: "0.45em",
            opacity: 0.9,
          }}
        >
          CLIENT PORTAL
        </motion.p>
      </div>

      {/* ============ BACKGROUND WATERMARK ============ */}
      <div
        className="absolute pointer-events-none select-none z-0"
        style={{
          top: "32%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          textAlign: "center",
          fontSize: "clamp(6rem, 22vw, 14rem)",
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: "rgba(139, 92, 246, 0.08)",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        ATB
      </div>
      <div
        className="absolute pointer-events-none select-none z-0"
        style={{
          top: "48%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          textAlign: "center",
          fontSize: "clamp(2rem, 8vw, 5rem)",
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: "rgba(139, 92, 246, 0.06)",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        VISUALS
      </div>

      {/* ============ FLOATING PORTFOLIO CARDS ============ */}
      <PortfolioCards />

      {/* ============ CENTER CONTENT ============ */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 min-h-[calc(100vh-140px)] pb-48 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md text-center"
        >
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-black mb-4 leading-tight"
            style={{
              fontSize: "clamp(2rem, 8.5vw, 3rem)",
              letterSpacing: "-0.03em",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 50px rgba(139, 92, 246, 0.4)",
              }}
            >
              Welcome{" "}
            </span>
            <span className="text-white">Back !</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-[13px] md:text-sm leading-relaxed mb-10 mx-auto"
            style={{ color: "#B8BCC8", maxWidth: "340px" }}
          >
            Access your Projects, Chat with ATB, Review Edits and Stay Updated —
            All in one Place!
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-sm mx-auto"
          >
            {/* Email input */}
            <div className="relative">
              <div
                className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#8B8FA0" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
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
                placeholder="yourself@email.com"
                className="w-full pl-14 pr-5 py-4 rounded-full text-sm transition-all"
                style={{
                  background: "rgba(20, 22, 30, 0.75)",
                  border: "1.5px solid rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(12px)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(139, 92, 246, 0.6)";
                  e.target.style.boxShadow =
                    "0 0 0 4px rgba(139, 92, 246, 0.12)";
                  e.target.style.background = "rgba(20, 22, 30, 0.95)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(20, 22, 30, 0.75)";
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="text-xs py-2.5 px-4 rounded-full text-center"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit — pill-shaped */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-4 rounded-full text-white font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              style={{
                background:
                  "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
                boxShadow:
                  "0 12px 32px rgba(139, 92, 246, 0.45), 0 0 0 1px rgba(255,255,255,0.1) inset, inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              {loading ? "Logging in..." : "Log In →"}
            </motion.button>
          </motion.form>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12"
          >
            <p
              className="text-[12px] leading-relaxed font-medium"
              style={{ color: "#B8BCC8" }}
            >
              Client Access only.
            </p>
            <p
              className="text-[12px] leading-relaxed font-medium"
              style={{ color: "#B8BCC8" }}
            >
              Contact &quot;ATB Visuals&quot; for an account
            </p>

            {/* Divider dots */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.3)" }}
              />
              <div
                className="w-24 h-px"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.3)" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ============ SIGNATURE — bottom-left ============ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute z-20 pointer-events-none"
        style={{
          left: "24px",
          bottom: "100px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-caveat), cursive",
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
            transform: "rotate(-4deg)",
            fontSize: "clamp(1.75rem, 6vw, 2.25rem)",
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

      {/* ============ BACKGROUND IMAGE ============ */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/5xwchyocd7/login-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.75,
        }}
      />
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5, 6, 10, 0.55) 0%, rgba(5, 6, 10, 0.35) 40%, rgba(5, 6, 10, 0.65) 100%)",
        }}
      />
    </div>
  );
}