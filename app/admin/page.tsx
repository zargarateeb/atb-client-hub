"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ProjectModal from "@/components/ProjectModal";

interface Client {
  _id: string;
  name: string;
  email: string;
  projectCount: number;
}

export default function AdminOverviewPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchClients = async () => {
    const res = await fetch("/api/admin/clients", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setClients(data.clients);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="label-caps mb-1" style={{ color: "#6a5f7c" }}>
          Overview
        </p>
        <h1 className="text-editorial text-white text-2xl">
          Clients &amp; Projects
        </h1>
        <p className="text-sm mt-1" style={{ color: "#9a8fb0" }}>
          Manage your clients and their active work.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <motion.button
          onClick={() => setModalOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="p-5 rounded-2xl text-left glass glass-hover"
        >
          <p className="text-2xl mb-2">+</p>
          <p className="text-sm font-bold text-white">New Project</p>
          <p className="text-[11px] mt-1" style={{ color: "#9a8fb0" }}>
            Create a project for a client
          </p>
        </motion.button>

        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl text-left glass glass-hover block"
        >
          <p className="text-2xl mb-2">💬</p>
          <p className="text-sm font-bold text-white">Messages</p>
          <p className="text-[11px] mt-1" style={{ color: "#9a8fb0" }}>
            Reply to client chats
          </p>
        </Link>

        <Link
          href="/admin/files"
          className="p-5 rounded-2xl text-left glass glass-hover block"
        >
          <p className="text-2xl mb-2">📁</p>
          <p className="text-sm font-bold text-white">Files</p>
          <p className="text-[11px] mt-1" style={{ color: "#9a8fb0" }}>
            View all uploads
          </p>
        </Link>
      </div>

      {/* Clients list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-white text-base">Clients</h2>
        <span className="tc text-[11px]" style={{ color: "#6a5f7c" }}>
          {clients.length} TOTAL
        </span>
      </div>

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
                {client.projectCount} PROJECT
                {client.projectCount !== 1 ? "S" : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchClients}
      />
    </div>
  );
}