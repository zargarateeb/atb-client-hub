"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const PROCESS = ["Story", "Ideas", "Edits", "Impact"];

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=JetBrains+Mono:wght@400;500&display=swap");

.atb-login {
  --bg: #050208;
  --panel: #07030d;
  --violet: #b98bff;
  --violet-bright: #e3c8ff;
  --deep: #2a0a52;
  --ink: #f6ecfb;
  --muted: #7c6f8c;
  --line: rgba(185, 139, 255, 0.22);
  --danger: #ff9bb0;
  box-sizing: border-box;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  background: var(--bg);
  color: var(--ink);
  font-family: "Bricolage Grotesque", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.atb-login *, .atb-login *::before, .atb-login *::after { box-sizing: border-box; }

.atb-stage {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 5vw, 72px);
  background: var(--bg);
  border-right: 1px solid var(--line);
}
.atb-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  pointer-events: none;
}
.atb-blob.b1 {
  width: 62%;
  aspect-ratio: 1;
  top: -18%;
  left: -20%;
  background: radial-gradient(circle at 60% 40%, rgba(80, 30, 130, 0.55), rgba(42, 10, 82, 0.25) 55%, transparent 75%);
}
.atb-blob.b2 {
  width: 55%;
  aspect-ratio: 1;
  bottom: -20%;
  right: -16%;
  background: radial-gradient(circle at 40% 60%, rgba(110, 50, 190, 0.5), rgba(42, 10, 82, 0.2) 55%, transparent 75%);
}

.atb-bracket {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 1px solid var(--line);
  opacity: 0.8;
  z-index: 2;
}
.atb-bracket.tl { top: 22px; left: 22px; border-right: 0; border-bottom: 0; }
.atb-bracket.br { bottom: 22px; right: 22px; border-left: 0; border-top: 0; }

.atb-process {
  position: absolute;
  top: clamp(22px, 4vw, 40px);
  left: clamp(22px, 4vw, 40px);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.atb-process span {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--muted);
}
.atb-process i {
  display: block;
  width: 20px;
  height: 1px;
  margin-top: 8px;
  background: var(--line);
  font-style: normal;
}

.atb-wordmark {
  position: absolute;
  top: clamp(22px, 4vw, 40px);
  right: clamp(22px, 4vw, 40px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}
.atb-wordmark span {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
.atb-wordmark i {
  display: block;
  width: 44px;
  height: 1px;
  background: linear-gradient(to right, var(--line), transparent);
}

.atb-crosshair {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  margin-left: -0.5px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--line) 8%,
    var(--line) 72%,
    transparent 92%
  );
  z-index: 1;
}
.atb-node {
  position: absolute;
  left: 50%;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  background: var(--violet);
  box-shadow: 0 0 12px 2px rgba(185, 139, 255, 0.7);
  z-index: 2;
}
.atb-node.n1 { top: 2%; }
.atb-node.n2 { top: 18%; }
.atb-node.n3 { top: 78%; }

.atb-logo-wrap {
  position: relative;
  z-index: 1;
  width: min(70%, 420px);
  perspective: 1200px;
}
.atb-logo-tilt {
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  animation: atb-drift 7s ease-in-out infinite;
}
.atb-logo-img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 46px rgba(185, 139, 255, 0.35));
}

@keyframes atb-drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.atb-tagline {
  position: relative;
  z-index: 1;
  margin-top: clamp(18px, 3vw, 30px);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: center;
}
.atb-tagline b { color: var(--violet); font-size: 6px; }

.atb-status {
  position: absolute;
  bottom: clamp(22px, 4vw, 36px);
  left: clamp(22px, 4vw, 40px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--muted);
}
.atb-status em {
  font-style: normal;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--violet);
  box-shadow: 0 0 8px 2px rgba(185, 139, 255, 0.7);
  animation: atb-blink 2s ease-in-out infinite;
}
@keyframes atb-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

.atb-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 5vw, 64px);
  background: var(--panel);
}
.atb-form-wrap { width: 100%; max-width: 380px; }

.atb-eyebrow {
  display: block;
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--violet);
}
.atb-title {
  margin: 0 0 12px;
  font-size: clamp(32px, 4vw, 44px);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.atb-sub { margin: 0 0 36px; color: var(--muted); font-size: 15px; line-height: 1.55; max-width: 34ch; }

.atb-field { display: block; }
.atb-field > span { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; letter-spacing: 0.02em; color: var(--ink); }
.atb-input {
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(185, 139, 255, 0.04);
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.atb-input::placeholder { color: #4d4358; }
.atb-input:focus-visible {
  border-color: var(--violet);
  background: rgba(185, 139, 255, 0.07);
  box-shadow: 0 0 0 4px rgba(185, 139, 255, 0.14);
}

.atb-button {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 56px;
  margin-top: 16px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--violet-bright), var(--violet));
  color: #1c0a33;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.25s, filter 0.2s;
  box-shadow: 0 10px 30px -10px rgba(185, 139, 255, 0.6);
}
.atb-button:hover:not(:disabled) { box-shadow: 0 14px 38px -8px rgba(185, 139, 255, 0.8); filter: brightness(1.05); }
.atb-button:active:not(:disabled) { transform: scale(0.985); }
.atb-button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.atb-button:disabled { cursor: progress; filter: saturate(0.7) brightness(0.9); }
.atb-button span { display: inline-block; transition: transform 0.15s ease-out; }

.atb-error {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 155, 176, 0.4);
  background: rgba(255, 155, 176, 0.08);
  color: var(--danger);
  font-size: 14px;
  line-height: 1.45;
}
.atb-error b { display: block; margin-bottom: 2px; color: var(--ink); font-weight: 500; }

.atb-help { margin: 28px 0 0; color: var(--muted); font-size: 14px; line-height: 1.5; }
.atb-help a { color: var(--ink); text-underline-offset: 3px; text-decoration-color: var(--line); }
.atb-help a:hover { text-decoration-color: var(--violet); }
.atb-help a:focus-visible { outline: 2px solid var(--violet); outline-offset: 3px; border-radius: 4px; }

@media (max-width: 900px) {
  .atb-login { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .atb-stage { padding: 84px 20px 32px; min-height: 46vh; border-right: 0; border-bottom: 1px solid var(--line); }
  .atb-process, .atb-status { display: none; }
  .atb-logo-wrap { width: min(78%, 300px); }
  .atb-panel { align-items: flex-start; padding-top: 36px; }
}

@media (prefers-reduced-motion: reduce) {
  .atb-logo-tilt { animation: none; transition: none; }
  .atb-status em { animation: none; }
  .atb-input, .atb-button, .atb-button span { transition: none; }
}
`;

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [btnOffset, setBtnOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: relY * -10, y: relX * 14 });
  };

  const handleStagePointerLeave = () => setTilt({ x: 0, y: 0 });

  const handleButtonPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || loading) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setBtnOffset({ x: relX * 10, y: relY * 8 });
  };

  const handleButtonPointerLeave = () => setBtnOffset({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("magic-link", {
        email: email.toLowerCase(),
        token: "dev-token",
        redirect: false,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push("/client");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="atb-login">
      <style>{styles}</style>

      <section
        className="atb-stage"
        aria-hidden="true"
        ref={stageRef}
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
      >
        <div className="atb-blob b1" />
        <div className="atb-blob b2" />
        <div className="atb-bracket tl" />
        <div className="atb-bracket br" />
        <div className="atb-crosshair" />
        <span className="atb-node n1" />
        <span className="atb-node n2" />
        <span className="atb-node n3" />

        <div className="atb-process">
          {PROCESS.map((step) => (
            <span key={step}>{step}</span>
          ))}
          <i />
        </div>

        <div className="atb-wordmark">
          <span>ATB Visuals</span>
          <i />
        </div>

        <div className="atb-logo-wrap">
          <div
            className="atb-logo-tilt"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <img
              className="atb-logo-img"
              src="https://ik.imagekit.io/5xwchyocd7/ATB-logo.png"
              alt="ATB Visuals"
            />
          </div>
        </div>

        <p className="atb-tagline">
          Video Editor <b>●</b> Motion Designer <b>●</b> Creative Solutions
        </p>

        <div className="atb-status">
          <em />
          Portal — Secure Session
        </div>
      </section>

      <section className="atb-panel">
        <div className="atb-form-wrap">
          <span className="atb-eyebrow">Client Access</span>
          <h1 className="atb-title">Step into the edit bay.</h1>
          <p className="atb-sub">
            Enter the email ATB Visuals has on file to open your projects.
          </p>

          <form onSubmit={handleSubmit} noValidate={false}>
            <label className="atb-field" htmlFor="email">
              <span>Email</span>
              <input
                id="email"
                name="email"
                className="atb-input"
                type="email"
                required
                autoComplete="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <button
              ref={buttonRef}
              className="atb-button"
              type="submit"
              disabled={loading}
              onPointerMove={handleButtonPointerMove}
              onPointerLeave={handleButtonPointerLeave}
            >
              <span style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}>
                {loading ? "Logging in..." : "Log In →"}
              </span>
            </button>

            {error && (
              <div className="atb-error" role="alert">
                <b>Couldn&apos;t log you in</b>
                {error}
              </div>
            )}
          </form>

          <p className="atb-help">
            No access yet? Email{" "}
            <a href="mailto:atb.visuals@gmail.com">atb.visuals@gmail.com</a> and
            we&apos;ll add you.
          </p>
        </div>
      </section>
    </main>
  );
}