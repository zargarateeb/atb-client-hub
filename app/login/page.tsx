"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Clip = { left: number; width: number; tone: "a" | "b" };

const VIDEO_TWO: Clip[] = [
  { left: 4, width: 22, tone: "a" },
  { left: 30, width: 18, tone: "b" },
  { left: 52, width: 30, tone: "a" },
  { left: 86, width: 10, tone: "b" },
];

const VIDEO_ONE: Clip[] = [
  { left: 0, width: 30, tone: "b" },
  { left: 32, width: 26, tone: "a" },
  { left: 60, width: 22, tone: "b" },
  { left: 84, width: 16, tone: "a" },
];

const AUDIO: Clip[] = [
  { left: 0, width: 47, tone: "a" },
  { left: 49, width: 51, tone: "a" },
];

const TICKS = Array.from({ length: 25 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, "0");

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Caveat:wght@700&display=swap");

.atbx {
  --bg: #050208;
  --panel: rgba(15, 8, 25, 0.55);
  --violet: #b98bff;
  --violet-bright: #e3c8ff;
  --deep: #2a0a52;
  --ink: #f6ecfb;
  --muted: #9a8fb0;
  --muted-2: #6a5f7c;
  --line: rgba(185, 139, 255, 0.22);
  --line-soft: rgba(185, 139, 255, 0.12);
  --danger: #ff9bb0;
  box-sizing: border-box;
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background: var(--bg);
  color: var(--ink);
  font-family: "Hanken Grotesk", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.atbx *, .atbx *::before, .atbx *::after { box-sizing: border-box; }

/* ============ LAYER 1: BACKGROUND IMAGE ============ */
.atbx-bg {
  position: absolute;
  inset: 0;
  background-image: url("https://ik.imagekit.io/5xwchyocd7/login-bg.png");
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.atbx-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(5, 2, 8, 0.55) 0%, rgba(5, 2, 8, 0.85) 60%, rgba(5, 2, 8, 0.98) 100%);
}

/* ============ LAYER 2: BLOBS ============ */
.atbx-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  filter: blur(80px);
}
.atbx-blob.b1 {
  width: 55vw;
  height: 55vw;
  top: -20%;
  left: -15%;
  background: radial-gradient(circle, rgba(120, 50, 200, 0.35) 0%, transparent 70%);
  animation: atbx-blob-drift 18s ease-in-out infinite;
}
.atbx-blob.b2 {
  width: 48vw;
  height: 48vw;
  bottom: -18%;
  right: -12%;
  background: radial-gradient(circle, rgba(185, 139, 255, 0.25) 0%, transparent 70%);
  animation: atbx-blob-drift 22s ease-in-out infinite reverse;
}
@keyframes atbx-blob-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(4%, -3%) scale(1.08); }
}

/* ============ LAYER 3: EDITOR CHROME (titlebar) ============ */
.atbx-chrome {
  position: relative;
  z-index: 10;
  height: 44px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(10, 5, 18, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line-soft);
}
.atbx-dots { display: flex; gap: 6px; }
.atbx-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}
.atbx-dots span:nth-child(1) { background: rgba(255, 137, 108, 0.65); }
.atbx-dots span:nth-child(2) { background: rgba(255, 200, 100, 0.65); }
.atbx-dots span:nth-child(3) { background: rgba(120, 220, 150, 0.65); }

.atbx-chrome-app {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 6px;
}
.atbx-chrome-app img {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(185, 139, 255, 0.5));
}
.atbx-chrome-app .name {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.atbx-chrome-app .sub {
  font-size: 13px;
  color: var(--muted);
}
.atbx-chrome-app .sub::before {
  content: "—";
  margin-right: 6px;
  color: var(--muted-2);
}
.atbx-chrome-spacer { flex: 1; }
.atbx-chrome-tc {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.05em;
}

/* ============ LAYER 4: TIMELINE (decorative bg) ============ */
.atbx-timeline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 28px 24px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.85;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
}
.atbx-tl-grid {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  column-gap: 14px;
  max-width: 900px;
  margin: 0 auto;
}
.atbx-tl-labels {
  padding-top: 22px;
  display: grid;
  grid-auto-rows: 42px;
  row-gap: 6px;
}
.atbx-tl-labels span {
  display: flex;
  align-items: center;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: var(--muted-2);
  letter-spacing: 0.1em;
}
.atbx-tl-labels span:nth-child(3) { height: 52px; }
.atbx-tl-lanes { position: relative; }

.atbx-tl-ruler {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 16px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--line-soft);
}
.atbx-tl-ruler i {
  width: 1px;
  height: 5px;
  background: rgba(185, 139, 255, 0.25);
}
.atbx-tl-ruler i:nth-child(5n + 1) {
  height: 10px;
  background: rgba(185, 139, 255, 0.5);
}

.atbx-tl-lane {
  position: relative;
  height: 42px;
  margin-bottom: 6px;
}
.atbx-tl-lane.audio { height: 52px; margin-bottom: 0; }

.atbx-clip {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 6px;
  transform-origin: left center;
  animation: atbx-clip-grow 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.atbx-clip.a {
  background: linear-gradient(135deg, rgba(109, 31, 179, 0.85), rgba(60, 10, 105, 0.9));
  border: 1px solid rgba(185, 139, 255, 0.4);
}
.atbx-clip.b {
  background: linear-gradient(135deg, rgba(227, 200, 255, 0.7), rgba(185, 139, 255, 0.8));
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.atbx-tl-lane.audio .atbx-clip {
  background:
    repeating-linear-gradient(90deg, rgba(185, 139, 255, 0.55) 0 2px, transparent 2px 5px) center / 100% 46% no-repeat,
    rgba(60, 10, 105, 0.45);
  border: 1px solid rgba(185, 139, 255, 0.25);
}
@keyframes atbx-clip-grow {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}

.atbx-playhead {
  position: absolute;
  top: 0;
  bottom: -8px;
  width: 2px;
  margin-left: -1px;
  background: var(--violet-bright);
  box-shadow: 0 0 14px 2px rgba(185, 139, 255, 0.7);
  transition: left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 3;
}
.atbx-playhead::before {
  content: "";
  position: absolute;
  top: -2px;
  left: 50%;
  width: 12px;
  height: 12px;
  transform: translateX(-50%);
  background: var(--violet-bright);
  clip-path: polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%);
}
.atbx-playhead.scrub {
  animation: atbx-scrub 1.6s ease-in-out infinite alternate;
  transition: none;
}
@keyframes atbx-scrub {
  from { left: 4%; }
  to { left: 96%; }
}
.atbx-timecode {
  position: absolute;
  top: -26px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--violet-bright);
  color: var(--deep);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 0 16px rgba(185, 139, 255, 0.5);
}

/* ============ LAYER 5: CROSSHAIR + NODES ============ */
.atbx-crosshair {
  position: absolute;
  left: 50%;
  top: 44px;
  bottom: 0;
  width: 1px;
  margin-left: -0.5px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--line-soft) 10%,
    var(--line-soft) 70%,
    transparent 92%
  );
  z-index: 3;
  pointer-events: none;
}
.atbx-node {
  position: absolute;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  border-radius: 50%;
  background: var(--violet);
  box-shadow: 0 0 12px 2px rgba(185, 139, 255, 0.7);
  z-index: 4;
  pointer-events: none;
}
.atbx-node.n1 { top: 8%; }
.atbx-node.n2 { top: 22%; }
.atbx-node.n3 { top: 74%; }

/* ============ LAYER 6: TOP CORNERS ============ */
.atbx-corner-tl,
.atbx-corner-tr {
  position: absolute;
  top: 68px;
  z-index: 5;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--muted-2);
  pointer-events: none;
}
.atbx-corner-tl { left: 28px; display: flex; flex-direction: column; gap: 3px; }
.atbx-corner-tr { right: 28px; text-align: right; display: flex; flex-direction: column; gap: 3px; }

/* ============ MAIN CONTENT ============ */
.atbx-main {
  position: relative;
  z-index: 20;
  min-height: calc(100dvh - 44px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 260px;
}

.atbx-brand-wrap {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  perspective: 1200px;
  margin-bottom: 22px;
  text-align: center;
}
.atbx-brand-tilt {
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  animation: atbx-drift 7s ease-in-out infinite;
}
@keyframes atbx-drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.atbx-brand-name {
  font-family: "Hanken Grotesk", sans-serif;
  font-weight: 800;
  font-size: clamp(2.5rem, 10vw, 3.75rem);
  letter-spacing: -0.04em;
  line-height: 1;
  display: inline-block;
}
.atbx-brand-name .left {
  color: #ffffff;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
}
.atbx-brand-name .right {
  background: linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 60px rgba(185, 139, 255, 0.6);
}
.atbx-brand-sub {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 12px;
}
.atbx-brand-tags {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.24em;
  color: var(--muted-2);
  margin-top: 10px;
}

/* ============ WELCOME TEXT ============ */
.atbx-welcome {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 22px;
}
.atbx-welcome h2 {
  margin: 0 0 10px;
  font-size: clamp(1.75rem, 7vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.atbx-welcome .purple {
  background: linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.atbx-welcome p {
  margin: 0 auto;
  max-width: 340px;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(246, 236, 251, 0.72);
}

/* ============ GLASS CARD ============ */
.atbx-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 380px;
  border-radius: 22px;
  padding: 22px;
  background: var(--panel);
  backdrop-filter: blur(28px) saturate(140%);
  -webkit-backdrop-filter: blur(28px) saturate(140%);
  border: 1px solid rgba(185, 139, 255, 0.22);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 1px 0 rgba(255, 255, 255, 0.08) inset,
    0 0 80px rgba(185, 139, 255, 0.15);
}

.atbx-field {
  position: relative;
  display: block;
  margin-bottom: 12px;
}
.atbx-field-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.45);
  pointer-events: none;
}
.atbx-input {
  width: 100%;
  height: 52px;
  padding: 0 16px 0 46px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink);
  font: inherit;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.atbx-input::placeholder { color: rgba(154, 143, 176, 0.6); }
.atbx-input:focus-visible {
  border-color: rgba(185, 139, 255, 0.55);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(185, 139, 255, 0.14);
}

.atbx-button {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 52px;
  margin-top: 4px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%);
  color: #1c0a33;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.25s, filter 0.2s;
  box-shadow:
    0 10px 30px -10px rgba(185, 139, 255, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 1px 0 rgba(255, 255, 255, 0.3) inset;
}
.atbx-button:hover:not(:disabled) {
  box-shadow:
    0 14px 38px -8px rgba(185, 139, 255, 0.9),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset,
    0 1px 0 rgba(255, 255, 255, 0.35) inset;
  filter: brightness(1.05);
}
.atbx-button:active:not(:disabled) { transform: scale(0.99); }
.atbx-button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.atbx-button:disabled { cursor: progress; filter: saturate(0.7) brightness(0.9); }

.atbx-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0 12px;
}
.atbx-or::before,
.atbx-or::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}
.atbx-or span {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.45);
}

.atbx-help {
  margin: 0;
  text-align: center;
  font-size: 11px;
  line-height: 1.55;
  color: rgba(246, 236, 251, 0.55);
}

.atbx-error {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 155, 176, 0.35);
  background: rgba(255, 155, 176, 0.08);
  color: var(--danger);
  font-size: 13px;
  line-height: 1.45;
}
.atbx-error b { display: block; margin-bottom: 2px; color: var(--ink); font-weight: 500; }

/* ============ SIGNATURE ============ */
.atbx-signature {
  position: absolute;
  left: 28px;
  bottom: 28px;
  z-index: 15;
  pointer-events: none;
}
.atbx-signature p {
  margin: 0;
  font-family: "Caveat", cursive;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 30px rgba(185, 139, 255, 0.5);
  transform: rotate(-5deg);
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  line-height: 0.95;
}

/* ============ BOTTOM-RIGHT TAG ============ */
.atbx-corner-br {
  position: absolute;
  right: 28px;
  bottom: 28px;
  z-index: 15;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted-2);
  text-align: right;
  pointer-events: none;
}

/* ============ RESPONSIVE ============ */
/* ============ MOBILE — KEEP FULL EXPERIENCE ============ */
@media (max-width: 860px) {
  /* Main content padding — smaller, tighter */
  .atbx-main {
    padding: 24px 16px 220px;
    min-height: calc(100dvh - 44px);
  }

  /* Timeline — visible but shorter and tighter */
  .atbx-timeline {
    padding: 12px 14px 16px;
    opacity: 0.75;
  }
  .atbx-tl-grid {
    grid-template-columns: 24px minmax(0, 1fr);
    column-gap: 8px;
  }
  .atbx-tl-labels {
    padding-top: 18px;
    grid-auto-rows: 32px;
    row-gap: 4px;
  }
  .atbx-tl-labels span {
    font-size: 8px;
  }
  .atbx-tl-labels span:nth-child(3) {
    height: 40px;
  }
  .atbx-tl-ruler {
    height: 12px;
    margin-bottom: 4px;
  }
  .atbx-tl-lane {
    height: 32px;
    margin-bottom: 4px;
  }
  .atbx-tl-lane.audio {
    height: 40px;
  }

  /* Corner text — kept, smaller */
  .atbx-corner-tl,
  .atbx-corner-tr {
    top: 54px;
    font-size: 8px;
    letter-spacing: 0.22em;
  }
  .atbx-corner-tl {
    left: 14px;
    gap: 2px;
  }
  .atbx-corner-tr {
    right: 14px;
    gap: 2px;
  }

  /* Crosshair + nodes — kept, subtle */
  .atbx-crosshair {
    top: 44px;
    opacity: 0.6;
  }
  .atbx-node {
    width: 5px;
    height: 5px;
    margin-left: -2.5px;
  }

  /* Chrome — hide subtitle/timecode to avoid crowding */
  .atbx-chrome {
    padding: 0 12px;
    height: 40px;
    gap: 10px;
  }
  .atbx-chrome-app .sub,
  .atbx-chrome-tc {
    display: none;
  }
  .atbx-chrome-app img {
    width: 16px;
    height: 16px;
  }
  .atbx-chrome-app .name {
    font-size: 12px;
  }

  /* Brand */
  .atbx-brand-wrap {
    margin-bottom: 16px;
  }
  .atbx-brand-sub {
    font-size: 10px;
    letter-spacing: 0.35em;
  }
  .atbx-brand-tags {
    font-size: 8px;
    letter-spacing: 0.2em;
  }

  /* Welcome */
  .atbx-welcome {
    margin-bottom: 18px;
  }
  .atbx-welcome p {
    font-size: 12px;
    max-width: 300px;
  }

  /* Glass card */
  .atbx-card {
    padding: 18px;
    border-radius: 18px;
  }
  .atbx-input {
    height: 48px;
    font-size: 14px;
    padding-left: 44px;
  }
  .atbx-button {
    height: 48px;
    font-size: 14px;
  }
  .atbx-help {
    font-size: 10px;
  }

  /* Signature — keep position absolute, bottom-left */
  .atbx-signature {
    left: 14px;
    bottom: 14px;
  }
  .atbx-signature p {
    font-size: 1.35rem;
  }

  /* Bottom-right tag — keep, smaller */
  .atbx-corner-br {
    right: 14px;
    bottom: 14px;
    font-size: 7px;
    letter-spacing: 0.18em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .atbx-clip,
  .atbx-playhead,
  .atbx-blob,
  .atbx-brand-tilt { animation: none !important; }
  .atbx-playhead.scrub { animation: none !important; left: 50% !important; }
  .atbx-input,
  .atbx-button,
  .atbx-brand-tilt,
  .atbx-playhead { transition: none; }
}
`;

function renderClips(clips: Clip[], row: number) {
  return clips.map((c, i) => (
    <div
      key={`${row}-${i}`}
      className={`atbx-clip ${c.tone}`}
      style={{
        left: `${c.left}%`,
        width: `${c.width}%`,
        animationDelay: `${row * 120 + i * 90}ms`,
      }}
    />
  ));
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  const isAdminEmail = adminEmail && email.toLowerCase() === adminEmail;
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || loading) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: relY * -8, y: relX * 12 });
  };

  const handlePointerLeave = () => setTilt({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("magic-link", {
        email: email.toLowerCase(),
        token: "dev-token",
        password: isAdminEmail ? password : "",
        redirect: false,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      // Check role and redirect accordingly
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      if (sessionData?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/client");
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.min(email.length, 24) / 24;
  const playheadLeft = 6 + progress * 88;
  const frames = email.length * 3;
  const timecode = `00:${pad(Math.floor(frames / 24))}:${pad(frames % 24)}`;

  return (
    <main
      className="atbx"
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <style>{styles}</style>

      {/* LAYER 1: Background image */}
      <div className="atbx-bg" />

      {/* LAYER 2: Blobs */}
      <div className="atbx-blob b1" />
      <div className="atbx-blob b2" />

      {/* LAYER 3: Editor chrome */}
      <div className="atbx-chrome">
        <div className="atbx-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="atbx-chrome-app">
          <img
            src="https://ik.imagekit.io/5xwchyocd7/ATB-logo.png"
            alt=""
            aria-hidden="true"
          />
          <span className="name">ATB Visuals</span>
          <span className="sub">Client Portal</span>
        </div>
        <div className="atbx-chrome-spacer" />
        <span className="atbx-chrome-tc">{loading ? "REC" : timecode}</span>
      </div>

      {/* LAYER 3.5: Crosshair + nodes */}
      <div className="atbx-crosshair" />
      <span className="atbx-node n1" />
      <span className="atbx-node n2" />
      <span className="atbx-node n3" />

      {/* LAYER 4: Corner text */}
      <div className="atbx-corner-tl">
        <span>Ideas</span>
        <span>Edits</span>
        <span>Brands</span>
        <span>Together</span>
      </div>
      <div className="atbx-corner-tr">
        <span>Video Editing</span>
        <span>Motion Graphics</span>
        <span>Brand Content</span>
      </div>

      {/* LAYER 4.5: Timeline */}
      <div className="atbx-timeline" aria-hidden="true">
        <div className="atbx-tl-grid">
          <div className="atbx-tl-labels">
            <span>V2</span>
            <span>V1</span>
            <span>A1</span>
          </div>
          <div className="atbx-tl-lanes">
            <div className="atbx-tl-ruler">
              {TICKS.map((t) => (
                <i key={t} />
              ))}
            </div>
            <div className="atbx-tl-lane">{renderClips(VIDEO_TWO, 0)}</div>
            <div className="atbx-tl-lane">{renderClips(VIDEO_ONE, 1)}</div>
            <div className="atbx-tl-lane audio">{renderClips(AUDIO, 2)}</div>
            <div
              className={loading ? "atbx-playhead scrub" : "atbx-playhead"}
              style={loading ? undefined : { left: `${playheadLeft}%` }}
            >
              <span className="atbx-timecode">
                {loading ? "Opening" : timecode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 6: Main content */}
      <div className="atbx-main">
        {/* Brand */}
        <div className="atbx-brand-wrap">
          <div
            className="atbx-brand-tilt"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            <h1 className="atbx-brand-name">
              <span className="left">ATB </span>
              <span className="right">Visuals</span>
            </h1>
          </div>
          <p className="atbx-brand-sub">Client Portal</p>
          <p className="atbx-brand-tags">
            Projects / Reviews / Updates / Collaborate
          </p>
        </div>

        {/* Welcome */}
        <div className="atbx-welcome">
          <h2>
            <span className="purple">Welcome </span>
            <span style={{ color: "#ffffff" }}>Back 👋</span>
          </h2>
          <p>
            Access your projects, chat with ATB, review edits and stay
            updated — all in one place.
          </p>
        </div>

        {/* Glass card */}
        <div className="atbx-card">
          <form onSubmit={handleSubmit}>
            <label className="atbx-field" htmlFor="email">
              <span className="atbx-field-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="18"
                  height="18"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 6 10-6" />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                className="atbx-input"
                type="email"
                required
                autoComplete="email"
                placeholder="yourself@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isAdminEmail && (
  <div className="atb-field" style={{ marginTop: 12 }}>
    <div style={{ position: "relative" }}>
      <span
        className="atbx-field-icon"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255,255,255,0.45)",
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          width="18"
          height="18"
        >
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3" />
        </svg>
      </span>
      <input
        id="password"
        name="password"
        className="atb-input"
        type={showPassword ? "text" : "password"}
        required
        autoComplete="current-password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword((p) => !p)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255,255,255,0.55)",
          background: "transparent",
          border: 0,
          cursor: "pointer",
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showPassword ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M3 3l18 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
    <p
      style={{
        fontSize: 10,
        color: "#b98bff",
        marginTop: 6,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      ⚿ Admin access — password required
    </p>
  </div>
)}
            </label>

            <button className="atbx-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In →"}
            </button>

            {error && (
              <div className="atbx-error" role="alert">
                <b>Couldn&apos;t log you in</b>
                {error}
              </div>
            )}
          </form>

          <div className="atbx-or">
            <span>OR</span>
          </div>

          <p className="atbx-help">
            Client Access only.
            <br />
            Contact &quot;ATB Visuals&quot; for an account.
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="atbx-signature">
        <p>
          Let&apos;s
          <br />
          Create
          <br />
          Something
          <br />
          Amazing.
        </p>
      </div>

      {/* Bottom-right tag */}
      <div className="atbx-corner-br">
        Creative
        <br />
        Edits
        <br />
        Real Impact
      </div>
    </main>
  );
}