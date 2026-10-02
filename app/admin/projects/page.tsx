"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EditProjectModal from "@/components/EditProjectModal";

interface Project {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "review" | "delivered" | "cancelled";
  price?: number;
  deliveryDate?: string;
  thumbnailUrl?: string;
  clientId: { _id: string; name: string; email: string; role?: string };
}

const STATUS_OPTIONS = ["pending", "in-progress", "review", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "rgba(154, 143, 176, 0.15)", color: "#9a8fb0" },
  "in-progress": { bg: "rgba(185, 139, 255, 0.15)", color: "#e3c8ff" },
  review: { bg: "rgba(96, 165, 250, 0.15)", color: "#93c5fd" },
  delivered: { bg: "rgba(74, 222, 128, 0.15)", color: "#86efac" },
  cancelled: { bg: "rgba(255, 155, 176, 0.15)", color: "#ff9bb0" },
};

function getInitials(title: string): string {
  const words = title.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "AT";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const data = await res.json();
    if (data.success) {
      const clientProjects = (data.projects as Project[]).filter(
        (p) => p.clientId?.role !== "admin"
      );
      setProjects(clientProjects);
    }
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

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `Delete "${title}"?\n\nThis will also delete all messages and files linked to this project.`
      )
    )
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setEditModalOpen(true);
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Management
        </p>
        <h1 className="text-editorial text-white text-2xl">All Projects</h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Update status, thumbnails, and manage all client work.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#6a5f7c" }}>
            Loading...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm mb-2" style={{ color: "#9a8fb0" }}>
            No projects yet.
          </p>
          <p className="tc text-[10px]" style={{ color: "#4a4155" }}>
            CREATE A PROJECT FROM THE OVERVIEW PAGE
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p, i) => {
            const client = p.clientId as unknown as {
              name?: string;
              email?: string;
            };
            const statusStyle =
              STATUS_COLORS[p.status] || STATUS_COLORS.pending;
            const initials = getInitials(p.title);

            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl glass"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail preview */}
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                      color: "#ffffff",
                    }}
                  >
                    {p.thumbnailUrl ? (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
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
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
                </div>

                {/* Right side: status + edit + delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="tc text-[10px] px-2 py-1 rounded-full uppercase font-bold hidden md:inline-block"
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

                  {/* Edit button */}
                  <button
                    onClick={() => handleEdit(p)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      background: "rgba(185, 139, 255, 0.08)",
                      color: "#e3c8ff",
                      border: "1px solid rgba(185, 139, 255, 0.25)",
                    }}
                    aria-label="Edit project"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4"
                    >
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    disabled={deletingId === p._id}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                    style={{
                      background: "rgba(255, 155, 176, 0.08)",
                      color: "#ff9bb0",
                      border: "1px solid rgba(255, 155, 176, 0.25)",
                    }}
                    aria-label="Delete project"
                  >
                    {deletingId === p._id ? (
                      <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin border-[#ff9bb0]" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="w-4 h-4"
                      >
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSaved={fetchProjects}
        project={editingProject}
      />
    </div>
  );
}