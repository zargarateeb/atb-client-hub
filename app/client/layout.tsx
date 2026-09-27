"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ClientLayout({
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
  }, [status, router]);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#08090D" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "#8B5CF6",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm" style={{ color: "#6B6F80" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#08090D", color: "#FFFFFF" }}
    >
      <Sidebar userName={session?.user?.name || "there"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={session?.user?.name || "there"} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}