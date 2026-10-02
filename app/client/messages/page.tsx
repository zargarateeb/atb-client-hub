"use client";

import { useEffect, useState } from "react";
import MessagesThread from "@/components/MessagesThread";

interface Project {
  _id: string;
  title: string;
}

export default function MessagesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.projects.length > 0) {
        setProjects(data.projects);
        setSelected(data.projects[0]._id);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">
      <div className="mb-5">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Communication
        </p>
        <h1 className="text-editorial text-white text-2xl">Messages</h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Chat with ATB about your projects.
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
          <p className="text-sm" style={{ color: "#9a8fb0" }}>
            No projects yet.
          </p>
        </div>
      ) : (
        <>
          {projects.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {projects.map((p) => (
                <button
                  key={p._id}
                  onClick={() => setSelected(p._id)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                  style={{
                    background:
                      selected === p._id
                        ? "linear-gradient(135deg, #e3c8ff, #b98bff)"
                        : "rgba(185, 139, 255, 0.08)",
                    color: selected === p._id ? "#1c0a33" : "#9a8fb0",
                    border: "1px solid rgba(185, 139, 255, 0.2)",
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}

          {selected && <MessagesThread projectId={selected} />}
        </>
      )}
    </div>
  );
}