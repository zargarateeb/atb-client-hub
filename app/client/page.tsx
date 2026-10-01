"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import ProjectCard from "@/components/ProjectCard";
import PromoCard from "@/components/PromoCard";
import ActivityFeed from "@/components/ActivityFeed";
import MessagesPreview from "@/components/MessagesPreview";

interface Project {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "review" | "delivered" | "cancelled";
  price?: number;
  deliveryDate?: string;
  createdAt: string;
}

const STATUS_MAP: Record<
  Project["status"],
  "Editing" | "In Review" | "Finalizing"
> = {
  pending: "In Review",
  "in-progress": "Editing",
  review: "In Review",
  delivered: "Finalizing",
  cancelled: "In Review",
};

const PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80",
  "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400&q=80",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
];

function getProgress(status: Project["status"]): number {
  switch (status) {
    case "pending":
      return 10;
    case "in-progress":
      return 60;
    case "review":
      return 85;
    case "delivered":
      return 100;
    case "cancelled":
      return 0;
  }
}

function formatDeadline(dateString?: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}`;
}

export default function ClientHomePage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          setError(data.error || "Failed to load projects");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const activeProjects = projects.filter(
    (p) => p.status !== "delivered" && p.status !== "cancelled"
  );
  const deliveredProjects = projects.filter((p) => p.status === "delivered");

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects.length,
      trend: activeProjects.length > 0 ? "1" : undefined,
      iconBg: "rgba(185, 139, 255, 0.15)",
      iconColor: "#e3c8ff",
      accent: "rgba(185, 139, 255, 0.4)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      ),
    },
    {
      label: "Delivered",
      value: deliveredProjects.length,
      trend: deliveredProjects.length > 0 ? "2" : undefined,
      iconBg: "rgba(74, 222, 128, 0.15)",
      iconColor: "#86efac",
      accent: "rgba(74, 222, 128, 0.35)",
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
      iconBg: "rgba(96, 165, 250, 0.15)",
      iconColor: "#93c5fd",
      accent: "rgba(96, 165, 250, 0.35)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.2 3.6A8 8 0 0 1 21 12z" />
        </svg>
      ),
    },
    {
      label: "Pending Invoices",
      value: 1,
      iconBg: "rgba(251, 191, 36, 0.15)",
      iconColor: "#fcd34d",
      accent: "rgba(251, 191, 36, 0.35)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      ),
    },
  ];

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between mb-6 md:mb-8 flex-wrap gap-4">
        <div>
          <h1
            className="text-editorial text-white mb-2"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2rem)",
            }}
          >
            Hey {session?.user?.name || "there"} 👋
          </h1>
          <p className="text-[13px]" style={{ color: "#9a8fb0" }}>
            Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass tc text-[11px]"
          style={{ color: "#9a8fb0" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          {dateLabel}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* Active Projects + Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mb-6 md:mb-8">
        {/* Left: Active Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#b98bff",
                  boxShadow: "0 0 8px rgba(185, 139, 255, 0.7)",
                }}
              />
              <h2 className="font-bold text-white text-[16px]">
                Active Projects
              </h2>
              <span className="tc text-[11px]" style={{ color: "#6a5f7c" }}>
                ({activeProjects.length})
              </span>
            </div>
            <button
              className="text-[11px] font-semibold transition-colors"
              style={{ color: "#b98bff" }}
            >
              View All →
            </button>
          </div>

          {loading && (
            <div className="p-8 rounded-2xl glass text-center">
              <p className="text-[13px]" style={{ color: "#6a5f7c" }}>
                Loading projects...
              </p>
            </div>
          )}

          {error && (
            <div className="p-8 rounded-2xl glass text-center">
              <p className="text-[13px]" style={{ color: "#ff9bb0" }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && activeProjects.length === 0 && (
            <div
              className="p-8 rounded-2xl glass text-center"
              style={{ borderStyle: "dashed" }}
            >
              <p className="text-[13px] mb-2" style={{ color: "#9a8fb0" }}>
                No active projects yet.
              </p>
              <p className="tc text-[10px]" style={{ color: "#4a4155" }}>
                START A NEW PROJECT TO SEE IT HERE
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!loading &&
              !error &&
              activeProjects.slice(0, 5).map((project, i) => (
                <ProjectCard
                  key={project._id}
                  title={project.title}
                  thumbnail={PROJECT_IMAGES[i % PROJECT_IMAGES.length]}
                  progress={getProgress(project.status)}
                  status={STATUS_MAP[project.status]}
                  deadline={formatDeadline(project.deliveryDate)}
                  avatars={AVATARS}
                  extraCount={i % 2 === 0 ? 2 : undefined}
                />
              ))}
          </div>
        </div>

        {/* Right: Promo */}
        <div className="lg:col-span-1">
          <PromoCard />
        </div>
      </div>

      {/* Recent Activity + Latest Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        <ActivityFeed />
        <MessagesPreview />
      </div>
    </div>
  );
}