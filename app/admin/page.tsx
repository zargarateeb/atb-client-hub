"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import ProjectModal from "@/components/ProjectModal";

interface Client {
  _id: string;
  name: string;
  email: string;
  projectCount: number;
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/clients", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 relative">
      {/* Ambient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
              ATB Visuals · Admin
            </p>
            <h1 className="text-editorial text-white text-2xl">
              Clients &amp; Projects
            </h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 rounded-lg text-xs font-semibold glass text-white"
          >
            Log Out
          </button>
        </div>

        {/* Create Project */}
        <motion.button
          onClick={() => setModalOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mb-6 px-6 py-4 rounded-2xl font-semibold text-sm cursor-pointer glass"
          style={{ color: "#e3c8ff", border: "1px dashed rgba(185, 139, 255, 0.4)" }}
        >
          + Create New Project
        </motion.button>

        {/* Clients list */}
        {loading ? (
          <div className="text-center py-16 text-sm" style={{ color: "#6a5f7c" }}>
            Loading...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 rounded-2xl glass text-center">
            <p className="text-sm mb-2" style={{ color: "#9a8fb0" }}>
              No clients yet.
            </p>
            <p className="tc text-[10px]" style={{ color: "#4a4155" }}>
              CREATE A PROJECT TO ADD YOUR FIRST CLIENT
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {clients.map((client) => (
              <div
                key={client._id}
                className="flex items-center justify-between p-4 rounded-2xl glass glass-hover"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #e3c8ff, #b98bff, #8b5cf6)",
                      color: "#1c0a33",
                    }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {client.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "#9a8fb0" }}>
                      {client.email}
                    </p>
                  </div>
                </div>
                <span
                  className="tc text-[11px] px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(185, 139, 255, 0.15)",
                    color: "#e3c8ff",
                  }}
                >
                  {client.projectCount} PROJECT{client.projectCount !== 1 ? "S" : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchClients}
      />
    </div>
  );
}