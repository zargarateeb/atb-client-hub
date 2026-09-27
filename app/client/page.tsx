"use client";

import { useSession } from "next-auth/react";
import StatCard from "@/components/StatCard";
import ProjectCard from "@/components/ProjectCard";
import PromoCard from "@/components/PromoCard";
import ActivityFeed from "@/components/ActivityFeed";
import MessagesPreview from "@/components/MessagesPreview";

export default function ClientHomePage() {
  const { data: session } = useSession();

  const stats = [
    {
      label: "Active Projects",
      value: 3,
      trend: "1",
      iconBg: "rgba(139, 92, 246, 0.15)",
      iconColor: "#A78BFA",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      ),
    },
    {
      label: "Delivered Projects",
      value: 5,
      trend: "2",
      iconBg: "rgba(16, 185, 129, 0.15)",
      iconColor: "#34D399",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Unread Messages",
      value: 2,
      iconBg: "rgba(59, 130, 246, 0.15)",
      iconColor: "#60A5FA",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.2 3.6A8 8 0 0 1 21 12z" />
        </svg>
      ),
    },
    {
      label: "Pending Invoices",
      value: 1,
      iconBg: "rgba(245, 158, 11, 0.15)",
      iconColor: "#FBBF24",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1
            className="font-black text-white mb-2"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Hey {session?.user?.name || "there"} 👋
          </h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>
            Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium"
          style={{
            background: "#11131A",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#A0A3B1",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-3.5 h-3.5"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          Mon, 15 Sep 2026
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Active Projects + Promo */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
  {/* Left: Active Projects */}
  <div className="lg:col-span-2">
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-bold text-white text-lg">Active Projects</h2>
      <button
        className="text-xs font-semibold transition-colors flex items-center gap-1"
        style={{ color: "#A78BFA" }}
      >
        View All →
      </button>
    </div>

    <div className="flex flex-col gap-3">
      {[
        {
          title: "Brand Motion Edit — Swiggy",
          thumbnail:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
          progress: 80,
          status: "Editing" as const,
          deadline: "20 Sep",
          avatars: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
          ],
          extraCount: 2,
        },
        {
          title: "SaaS Explainer — DeepSeek AI",
          thumbnail:
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80",
          progress: 30,
          status: "In Review" as const,
          deadline: "18 Sep",
          avatars: [
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
          ],
          extraCount: 1,
        },
        {
          title: "Short Form Series — Spotify",
          thumbnail:
            "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400&q=80",
          progress: 90,
          status: "Finalizing" as const,
          deadline: "16 Sep",
          avatars: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
          ],
        },
      ].map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </div>
  </div>

  {/* Right: Promo */}
  <div className="lg:col-span-1">
    <PromoCard />
  </div>
</div>

      {/* Recent Activity + Latest Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <MessagesPreview />
      </div>
    </div>
  );
}