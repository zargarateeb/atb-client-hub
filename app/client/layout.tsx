"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileTopBar from "@/components/MobileTopBar";
import BottomNav from "@/components/BottomNav";
import MobileDrawer from "@/components/MobileDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050208" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "#b98bff",
              borderTopColor: "transparent",
            }}
          />
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "#6a5f7c", letterSpacing: "0.2em" }}
          >
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const userName = session?.user?.name || "there";

  return (
    <div
      className="relative min-h-screen flex overflow-hidden"
      style={{ background: "#050208", color: "#f6ecfb" }}
    >
      {/* Ambient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Crosshair accent (desktop only) */}
      <div
        className="crosshair hidden md:block"
        style={{ left: "calc(240px + 24px)" }}
      />

      {/* Desktop sidebar */}
      <Sidebar userName={userName} />

      {/* Main column */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Desktop header — hidden on mobile */}
        <div className="hidden md:block">
          <Header userName={userName} />
        </div>

        {/* Mobile top bar — hidden on desktop */}
        <MobileTopBar
          userName={userName}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        {/* Main content — mobile has bottom padding for bottom nav */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 min-h-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav
        onOpenDrawer={() => setDrawerOpen(true)}
        unreadMessages={2}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
      />
    </div>
  );
}