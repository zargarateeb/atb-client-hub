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
  {
    title: "PODCAST EDIT",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
    rotation: -14,
    position: { top: "16%", left: "1%" },
    delay: 0.1,
  },
  {
    title: "MOTION GRAPHICS",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    rotation: 13,
    position: { top: "18%", right: "1%" },
    delay: 0.2,
  },
  {
    title: "BRAND EDITS",
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80",
    rotation: -8,
    position: { top: "44%", left: "1%" },
    delay: 0.3,
  },
  {
    title: "SHORT FORM",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
    rotation: 9,
    position: { top: "46%", right: "1%" },
    delay: 0.4,
  },
];

export default function PortfolioCards() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 0.95, y: 0, rotate: card.rotation }}
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
            width: "clamp(110px, 28vw, 160px)",
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: card.delay,
            }}
            className="rounded-xl overflow-hidden"
            style={{
              background: "#11131A",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.7), 0 0 40px rgba(139, 92, 246, 0.15)",
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,9,13,0.1) 0%, rgba(8,9,13,0.5) 60%, rgba(8,9,13,0.9) 100%)",
                }}
              />
              {/* Title inside image bottom-left */}
              <div className="absolute bottom-1.5 left-2 right-2">
                <p
                  className="text-[8px] font-bold uppercase truncate"
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    letterSpacing: "0.08em",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {card.title}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}