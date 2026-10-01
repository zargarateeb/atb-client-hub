"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Project {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "review" | "delivered" | "cancelled";
  price?: number;
  deliveryDate?: string;
  clientId: { _id: string; name: string; email: string };
}

const STATUS_OPTIONS = ["pending", "in-progress", "review", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "rgba(154, 143, 176, 0.15)", color: "#9a8fb0" },
  "in-progress": { bg: "rgba(185, 139, 255, 0.15)", color: "#e3c8ff" },
  review: { bg: "rgba(96, 165, 250, 0.15)", color: "#93c5fd" },
  delivered: { bg: "rgba(74, 222, 128, 0.15)", color: "#86efac" },
  cancelled: { bg: "rgba(255, 155, 176, 0.15)", color: "#ff9bb0" },
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setProjects(data.projects);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setProjects((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: status as Project["status"] } : p
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Management
        </p>
        <h1 className="text-editorial text-white text-2xl">All Projects</h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Update status and track all active work.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#6a5f7c" }}>Loading...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#9a8fb0" }}>No projects yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p, i) => {
            const client = p.clientId as unknown as {
              name?: string;
              email?: string;
            };
            const statusStyle = STATUS_COLORS[p.status] || STATUS_COLORS.pending;

            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl glass"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: statusStyle.color,
                        boxShadow: `0 0 8px ${statusStyle.color}`,
                      }}
                    />
                    <p className="text-sm font-bold text-white truncate">
                      {p.title}
                    </p>
                  </div>
                  <p className="text-[11px]" style={{ color: "#9a8fb0" }}>
                    {client?.name || "Unknown"} · {client?.email || ""}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {p.deliveryDate && (
                      <span
                        className="tc text-[10px]"
                        style={{ color: "#6a5f7c" }}
                      >
                        📅 {new Date(p.deliveryDate).toLocaleDateString()}
                      </span>
                    )}
                    {p.price && (
                      <span
                        className="tc text-[10px]"
                        style={{ color: "#86efac" }}
                      >
                        ₹{p.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status dropdown */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="tc text-[10px] px-2 py-1 rounded-full uppercase font-bold"
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    {p.status}
                  </span>
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p._id, e.target.value)}
                    disabled={updatingId === p._id}
                    className="px-3 py-2 rounded-lg text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                    style={{
                      background: "rgba(15, 8, 25, 0.9)",
                      color: "#f6ecfb",
                      border: "1px solid rgba(185, 139, 255, 0.25)",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-neutral-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}