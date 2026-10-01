"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FileItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  uploadedBy: { name: string; email: string; role: string };
  projectId: { title: string } | null;
}

export default function AdminFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "client" | "admin">("all");

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("/api/admin/files", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setFiles(data.files);
      setLoading(false);
    };
    fetchFiles();
  }, []);

  const filtered = files.filter((f) => {
    if (filter === "all") return true;
    return f.uploadedBy?.role === filter;
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Storage
        </p>
        <h1 className="text-editorial text-white text-2xl">All Files</h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Every file uploaded across all projects.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", "client", "admin"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background:
                filter === f
                  ? "linear-gradient(135deg, #e3c8ff, #b98bff)"
                  : "rgba(185, 139, 255, 0.08)",
              color: filter === f ? "#1c0a33" : "#9a8fb0",
              border: "1px solid rgba(185, 139, 255, 0.2)",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "all" && ` (${files.length})`}
            {f === "client" &&
              ` (${files.filter((x) => x.uploadedBy?.role === "client").length})`}
            {f === "admin" &&
              ` (${files.filter((x) => x.uploadedBy?.role === "admin").length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#6a5f7c" }}>Loading...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center glass rounded-2xl">
          <p className="text-sm" style={{ color: "#9a8fb0" }}>No files yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((f, i) => (
            <motion.a
              key={f._id}
              href={f.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between p-4 rounded-2xl glass glass-hover"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {f.fileName}
                </p>
                <p className="tc text-[10px] mt-0.5" style={{ color: "#6a5f7c" }}>
                  {f.projectId?.title || "No project"} ·{" "}
                  {f.uploadedBy?.name || "Unknown"} ·{" "}
                  {formatBytes(f.fileSize)} ·{" "}
                  {new Date(f.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="tc text-[9px] px-2 py-0.5 rounded-full uppercase font-bold"
                  style={{
                    background:
                      f.uploadedBy?.role === "admin"
                        ? "rgba(185, 139, 255, 0.15)"
                        : "rgba(96, 165, 250, 0.15)",
                    color:
                      f.uploadedBy?.role === "admin" ? "#e3c8ff" : "#93c5fd",
                  }}
                >
                  {f.uploadedBy?.role || "unknown"}
                </span>
                <span className="text-xs font-semibold" style={{ color: "#b98bff" }}>
                  Download →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}