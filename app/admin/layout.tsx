"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      const role = (session?.user as { role?: string })?.role;
      if (role !== "admin") {
        router.push("/client");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050208" }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#b98bff", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") return null;

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#050208", color: "#f6ecfb" }}
    >
      {/* Ambient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Top bar */}
      <header
        className="relative z-20 flex items-center justify-between px-4 md:px-6 h-14 border-b flex-shrink-0"
        style={{
          background: "rgba(10, 5, 18, 0.85)",
          backdropFilter: "blur(24px) saturate(140%)",
          borderColor: "rgba(185, 139, 255, 0.14)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #e3c8ff 0%, #b98bff 50%, #8b5cf6 100%)",
              boxShadow: "0 0 16px rgba(185, 139, 255, 0.4)",
            }}
          >
            <img
              src="https://ik.imagekit.io/5xwchyocd7/ATB-logo.png"
              alt="ATB"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-tight">
              ATB Visuals — Admin
            </p>
            <p
              className="tc text-[9px] leading-tight"
              style={{ color: "#6a5f7c" }}
            >
              ADMIN CONTROL PANEL
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-4 py-2 rounded-lg text-[11px] font-semibold"
          style={{
            background: "rgba(255, 155, 176, 0.08)",
            color: "#ff9bb0",
            border: "1px solid rgba(255, 155, 176, 0.25)",
          }}
        >
          Log Out
        </button>
      </header>

      {/* Nav tabs */}
      <AdminNav />

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto min-h-0">{children}</main>
    </div>
  );
}