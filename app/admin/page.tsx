"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ProjectModal from "@/components/ProjectModal";
import StatCard from "@/components/StatCard";
import PushPermissionBanner from "@/components/PushPermissionBanner";

interface Client {
  _id: string;
  name: string;
  email: string;
  projectCount: number;
}

interface AdminStats {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  deliveredProjects: number;
  unreadMessages: number;
  totalFiles: number;
}

export default function AdminOverviewPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    deliveredProjects: 0,
    unreadMessages: 0,
    totalFiles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAll = async () => {
    const [clientsRes, statsRes] = await Promise.all([
      fetch("/api/admin/clients", { cache: "no-store" }),
      fetch("/api/admin/stats", { cache: "no-store" }),
    ]);
    const clientsData = await clientsRes.json();
    const statsData = await statsRes.json();
    if (clientsData.success) setClients(clientsData.clients);
    if (statsData.success) setStats(statsData.stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const statCards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
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
      value: stats.deliveredProjects,
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
      value: stats.unreadMessages,
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
      label: "Total Clients",
      value: stats.totalClients,
      iconBg: "rgba(251, 191, 36, 0.15)",
      iconColor: "#fcd34d",
      accent: "rgba(251, 191, 36, 0.35)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      {/* Push notifications banner */}
      <PushPermissionBanner />
      {/* Header */}
      <div className="mb-6">
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

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            accent={stat.accent}
          />
        ))}
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
        onSaved={fetchAll}
      />
    </div>
  );
}