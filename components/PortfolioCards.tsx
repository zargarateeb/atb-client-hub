"use client";

import { motion } from "framer-motion";

interface FloatCard {
  title: string;
  image: string;
  rotation: number;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay: number;
}

const CARDS: FloatCard[] = [
  // Top-left — podcast/audio work
  {
    title: "PODCAST EDIT",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
    rotation: -11,
    position: { top: "16%", left: "3%" },
    delay: 0.1,
  },
  // Top-right — motion graphics
  {
    title: "MOTION GRAPHICS",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    rotation: 10,
    position: { top: "14%", right: "3%" },
    delay: 0.2,
  },
  // Bottom-left — editing timeline
  {
    title: "SHORT FORM",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    rotation: -8,
    position: { bottom: "14%", left: "4%" },
    delay: 0.3,
  },
  // Bottom-right — color grading / studio
  {
    title: "BRAND EDITS",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80",
    rotation: 9,
    position: { bottom: "12%", right: "4%" },
    delay: 0.4,
  },
];

export default function PortfolioCards() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: card.rotation }}
          transition={{
            duration: 1.2,
            delay: card.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: "absolute",
            top: card.position.top,
            bottom: card.position.bottom,
            left: card.position.left,
            right: card.position.right,
            width: "clamp(180px, 14vw, 220px)",
          }}
          className="hidden xl:block"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: card.delay,
            }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#11131A",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,9,13,0) 30%, rgba(8,9,13,0.85) 100%)",
                }}
              />
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <p
                className="text-[10px] font-bold tracking-widest uppercase truncate"
                style={{ color: "#A0A3B1", letterSpacing: "0.12em" }}
              >
                {card.title}
              </p>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 ml-2"
                style={{
                  background: "#8B5CF6",
                  boxShadow: "0 0 10px rgba(139,92,246,0.7)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}