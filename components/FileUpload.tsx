"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FileUploadProps {
  projectId: string;
  onUploaded?: () => void;
}

export default function FileUpload({ projectId, onUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    try {
      // Simple progress simulation
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 90));
      }, 200);

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          onUploaded?.();
        }, 500);
      } else {
        alert(data.error || "Upload failed");
        setUploading(false);
      }
    } catch {
      alert("Upload failed");
      setUploading(false);
    }
  };

  return (
    <div>
      <label
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl cursor-pointer glass glass-hover"
        style={{ border: "1px dashed rgba(185, 139, 255, 0.35)" }}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b98bff"
          strokeWidth="1.5"
          className="w-6 h-6"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <p className="text-sm font-semibold text-white">
          {uploading ? "Uploading..." : "Click to upload"}
        </p>
        <p className="tc text-[9px]" style={{ color: "#6a5f7c" }}>
          MAX 100MB · ANY FORMAT
        </p>
      </label>

      {uploading && (
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #e3c8ff)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
}