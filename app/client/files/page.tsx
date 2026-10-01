"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";

interface Project {
  _id: string;
  title: string;
}

interface FileAsset {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export default function FilesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [projRes, fileRes] = await Promise.all([
      fetch("/api/projects", { cache: "no-store" }),
      fetch("/api/files", { cache: "no-store" }),
    ]);
    const projData = await projRes.json();
    const fileData = await fileRes.json();
    if (projData.success) setProjects(projData.projects);
    if (fileData.success) setFiles(fileData.files);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Storage
        </p>
        <h1 className="text-editorial text-white text-2xl">Files</h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Upload raw footage, download deliverables.
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
        <>
          <div className="mb-6">
            <FileUpload projectId={projects[0]._id} onUploaded={fetchAll} />
          </div>

          <h2 className="font-bold text-white mb-3 text-sm">
            Uploaded Files ({files.length})
          </h2>

          {files.length === 0 ? (
            <div className="p-8 text-center glass rounded-2xl">
              <p className="text-xs" style={{ color: "#6a5f7c" }}>
                No files uploaded yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {files.map((f) => (
                <a
                  key={f._id}
                  href={f.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl glass glass-hover"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {f.fileName}
                    </p>
                    <p className="tc text-[10px] mt-0.5" style={{ color: "#6a5f7c" }}>
                      {formatBytes(f.fileSize)} · {new Date(f.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#b98bff" }}>
                    Download →
                  </span>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}