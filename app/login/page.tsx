"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const BLADES = Array.from({ length: 6 }, (_, i) => i);

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=JetBrains+Mono:wght@400;500&display=swap");

.atb-login {
  --bg: #0a0313;
  --panel: #10061c;
  --violet: #e19aff;
  --deep: #3c0a69;
  --ink: #f6ecfb;
  --muted: #a48bb8;
  --line: rgba(225, 154, 255, 0.16);
  --danger: #ff9bb0;
  box-sizing: border-box;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
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
  background:
    radial-gradient(70% 60% at 20% 25%, rgba(60, 10, 105, 0.85), transparent 70%),
    radial-gradient(50% 45% at 85% 85%, rgba(225, 154, 255, 0.14), transparent 70%),
    var(--bg);
  border-right: 1px solid var(--line);
}
.atb-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(225, 154, 255, 0.07) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(80% 70% at 40% 50%, #000, transparent);
  -webkit-mask-image: radial-gradient(80% 70% at 40% 50%, #000, transparent);
}

.atb-brand {
  position: absolute;
  top: clamp(24px, 4vw, 44px);
  left: clamp(28px, 5vw, 72px);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.01em;
  z-index: 2;
}
.atb-mark {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--violet);
  box-shadow: 0 0 18px 2px rgba(225, 154, 255, 0.7);
}

/* --- 3D lens scene --- */
.atb-scene-wrap {
  position: relative;
  z-index: 1;
  width: min(60vh, 420px);
  height: min(60vh, 420px);
  perspective: 1400px;
}
.atb-rig {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.atb-orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--line);
  transform-style: preserve-3d;
}
.atb-orbit.o2 { inset: 10%; transform: translateZ(30px) rotateX(70deg); }
.atb-orbit.o3 { inset: -6%; transform: translateZ(-20px) rotateY(70deg); border-color: rgba(225, 154, 255, 0.1); }

.atb-lens-ring {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.35), transparent 40%),
    conic-gradient(from 210deg, #3c0a69, #6d1fb3, #e19aff, #6d1fb3, #3c0a69);
  box-shadow: 0 0 60px -10px rgba(225, 154, 255, 0.55), inset 0 0 40px rgba(10, 3, 19, 0.6);
  transform: translateZ(20px);
}
.atb-lens-glass {
  position: absolute;
  inset: 16%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.5), rgba(20, 6, 36, 0.9) 70%);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
  transform: translateZ(46px);
  overflow: hidden;
}

.atb-blades {
  position: absolute;
  inset: 0;
  animation: atb-spin 42s linear infinite;
}
.atb-blade {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 46%;
  height: 46%;
  transform-origin: 0% 0%;
  transform: rotate(calc(60deg * var(--i))) translate(-6%, -6%) rotate(calc(var(--iris, 0) * 50deg));
  background: linear-gradient(135deg, rgba(225, 154, 255, 0.9), rgba(60, 10, 105, 0.85));
  clip-path: polygon(0% 0%, 100% 18%, 34% 100%);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  opacity: 0.92;
}

.atb-lens-core {
  position: absolute;
  inset: 40%;
  border-radius: 50%;
  background: radial-gradient(circle, #fff, var(--violet) 55%, transparent 75%);
  transform: translateZ(52px);
  animation: atb-pulse 3.2s ease-in-out infinite;
}
.atb-lens-core.active { animation: atb-pulse 0.7s ease-in-out infinite; }

@keyframes atb-spin {
  from { transform: rotateZ(0deg); }
  to { transform: rotateZ(360deg); }
}
@keyframes atb-pulse {
  0%, 100% { opacity: 0.55; filter: blur(0.5px); }
  50% { opacity: 1; filter: blur(0px); }
}

.atb-chip {
  position: absolute;
  width: 15%;
  aspect-ratio: 1.6;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: linear-gradient(135deg, rgba(225, 154, 255, 0.16), rgba(60, 10, 105, 0.3));
  backdrop-filter: blur(2px);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.atb-chip-float { animation: atb-float 6s ease-in-out infinite; }
.atb-chip.c1 { top: 6%; left: -4%; }
.atb-chip.c2 { bottom: 10%; right: -8%; animation-delay: -2s; }
.atb-chip.c3 { top: 58%; left: -10%; width: 11%; animation-delay: -4s; }

@keyframes atb-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.atb-caption {
  position: relative;
  z-index: 1;
  max-width: 420px;
  width: 100%;
  margin-top: clamp(20px, 4vh, 40px);
  text-align: center;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
}
.atb-caption strong { color: var(--ink); font-weight: 500; }

.atb-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 5vw, 64px);
  background: var(--panel);
}
.atb-form-wrap { width: 100%; max-width: 380px; }

.atb-title {
  margin: 0 0 12px;
  font-size: clamp(34px, 4.2vw, 48px);
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: -0.035em;
}
.atb-sub { margin: 0 0 36px; color: var(--muted); font-size: 16px; line-height: 1.5; max-width: 34ch; }

.atb-field { display: block; }
.atb-field > span { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--ink); }
.atb-input {
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(225, 154, 255, 0.05);
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.atb-input::placeholder { color: rgba(164, 139, 184, 0.6); }
.atb-input:focus-visible {
  border-color: var(--violet);
  background: rgba(225, 154, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(225, 154, 255, 0.16);
}

.atb-button {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 56px;
  margin-top: 16px;
  border: 0;
  border-radius: 14px;
  background: var(--violet);
  color: #250544;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.25s, filter 0.2s;
  box-shadow: 0 10px 30px -10px rgba(225, 154, 255, 0.65);
}
.atb-button:hover:not(:disabled) { box-shadow: 0 14px 38px -8px rgba(225, 154, 255, 0.85); filter: brightness(1.06); }
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
.atb-help a { color: var(--ink); text-underline-offset: 3px; text-decoration-color: rgba(225, 154, 255, 0.5); }
.atb-help a:hover { text-decoration-color: var(--violet); }
.atb-help a:focus-visible { outline: 2px solid var(--violet); outline-offset: 3px; border-radius: 4px; }

@media (max-width: 900px) {
  .atb-login { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .atb-stage { padding: 88px 20px 32px; border-right: 0; border-bottom: 1px solid var(--line); }
  .atb-scene-wrap { width: min(52vw, 260px); height: min(52vw, 260px); }
  .atb-caption { display: none; }
  .atb-panel { align-items: flex-start; padding-top: 36px; }
}

@media (prefers-reduced-motion: reduce) {
  .atb-blades { animation: none; }
  .atb-lens-core { animation: none; opacity: 0.85; }
  .atb-chip-float { animation: none; }
  .atb-rig, .atb-input, .atb-button, .atb-button span, .atb-blade { transition: none; }
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
    setTilt({ x: relY * -18, y: relX * 22 });
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

  const iris = loading ? 1 : Math.min(email.length, 20) / 20;

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
        <div className="atb-brand">
          <span className="atb-mark" />
          ATB Visuals
        </div>

        <div className="atb-scene-wrap">
          <div
            className="atb-rig"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            <div className="atb-orbit o3" />
            <div className="atb-orbit o2" />
            <div className="atb-lens-ring" />
            <div className="atb-lens-glass">
              <div className="atb-blades" style={loading ? { animationDuration: "2.4s" } : undefined}>
                {BLADES.map((i) => (
                  <span
                    key={i}
                    className="atb-blade"
                    style={{ ["--i" as string]: i, ["--iris" as string]: iris } as React.CSSProperties}
                  />
                ))}
              </div>
              <div className={loading ? "atb-lens-core active" : "atb-lens-core"} />
            </div>

            <div className="atb-chip c1" style={{ transform: `translate3d(${tilt.y * 0.6}px, ${tilt.x * 0.6}px, 0)` }}>
              <div className="atb-chip-float" style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="atb-chip c2" style={{ transform: `translate3d(${tilt.y * 0.9}px, ${tilt.x * 0.9}px, 0)` }}>
              <div className="atb-chip-float" style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="atb-chip c3" style={{ transform: `translate3d(${tilt.y * 0.4}px, ${tilt.x * 0.4}px, 0)` }}>
              <div className="atb-chip-float" style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>

        <p className="atb-caption">
          <strong>{loading ? "Focusing on your account..." : "Every project, in focus."}</strong>
          <br />
          Review cuts, leave feedback and download finals from your client dashboard.
        </p>
      </section>

      <section className="atb-panel">
        <div className="atb-form-wrap">
          <h1 className="atb-title">Your cuts are waiting.</h1>
          <p className="atb-sub">
            Enter the email ATB Visuals has Provided to open your projects.
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
            <a href="mailto:visuals.atb@gmail.com">visuals.atb@gmail.com</a> and
            we&apos;ll add you.
          </p>
        </div>
      </section>
    </main>
  );
}