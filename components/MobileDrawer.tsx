"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const DRAWER_ITEMS = [
  {
    href: "/client/invoices",
    label: "Invoices",
    code: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    href: "/client/feedback",
    label: "Feedback",
    code: "05",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function MobileDrawer({ isOpen, onClose, userName }: MobileDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-[100]"
            style={{
              background: "rgba(5, 2, 8, 0.75)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-0 right-0 bottom-0 z-[101] w-[85%] max-w-sm flex flex-col"
            style={{
              background: "rgba(10, 5, 18, 0.98)",
              backdropFilter: "blur(30px) saturate(140%)",
              WebkitBackdropFilter: "blur(30px) saturate(140%)",
              borderLeft: "1px solid rgba(185, 139, 255, 0.18)",
              boxShadow: "-24px 0 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0"
              style={{ borderColor: "rgba(185, 139, 255, 0.14)" }}
            >
              <p
                className="text-[10px] font-semibold uppercase"
                style={{ color: "#6a5f7c", letterSpacing: "0.22em" }}
              >
                Menu
              </p>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(15, 8, 25, 0.7)",
                  color: "#9a8fb0",
                  border: "1px solid rgba(185, 139, 255, 0.12)",
                }}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User chip */}
            <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(185, 139, 255, 0.14)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
                    color: "#1c0a33",
                    boxShadow: "0 0 20px rgba(185, 139, 255, 0.45)",
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-white truncate">
                    {userName}
                  </p>
                  <p
                    className="tc text-[10px] mt-0.5"
                    style={{ color: "#6a5f7c" }}
                  >
                    CLIENT · ATB VISUALS
                  </p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              <p
                className="text-[9px] font-semibold uppercase px-3 mb-2"
                style={{ color: "#4a4155", letterSpacing: "0.22em" }}
              >
                More
              </p>

              {DRAWER_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="relative flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium transition-colors"
                    style={{
                      color: isActive ? "#f6ecfb" : "#9a8fb0",
                      background: isActive ? "rgba(185, 139, 255, 0.12)" : "transparent",
                    }}
                  >
                    <span style={{ color: isActive ? "#e3c8ff" : "inherit" }}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span
                      className="tc text-[10px]"
                      style={{ color: isActive ? "#b98bff" : "#4a4155" }}
                    >
                      {item.code}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Signature */}
            <div
              className="px-5 py-4 border-t"
              style={{ borderColor: "rgba(185, 139, 255, 0.14)" }}
            >
              <p
                className="text-[13px] mb-4"
                style={{
                  fontFamily: "var(--font-script), cursive",
                  color: "rgba(255,255,255,0.75)",
                  transform: "rotate(-3deg)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Let&apos;s Create
                <br />
                Something Amazing.
              </p>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[14px] font-semibold transition-colors"
                style={{
                  background: "rgba(255, 155, 176, 0.08)",
                  color: "#ff9bb0",
                  border: "1px solid rgba(255, 155, 176, 0.25)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5M21 12H9" />
                </svg>
                Log Out
              </button>

              <p
                className="text-center text-[9px] mt-4 tc"
                style={{ color: "#4a4155" }}
              >
                ATB HUB · v1.0 · SECURE
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}