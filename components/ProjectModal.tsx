"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectModal({
  isOpen,
  onClose,
  onSaved,
}: ProjectModalProps) {
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setClientEmail("");
      setClientName("");
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPrice("");
      setDeliveryDate("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail,
          clientName,
          title,
          description,
          status,
          price,
          deliveryDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else {
        setError(data.error || "Failed to create project");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg rounded-3xl p-6 md:p-8 pointer-events-auto max-h-[92vh] overflow-y-auto glass">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>

              <h2 className="font-bold text-2xl text-white mb-6">
                Create Project
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                      Client Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4a4155] focus:border-[#b98bff] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4a4155] focus:border-[#b98bff] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brand Motion Edit — Client Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4a4155] focus:border-[#b98bff] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4a4155] focus:border-[#b98bff] focus:outline-none text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b98bff] focus:outline-none text-sm cursor-pointer"
                    >
                      <option value="pending" className="bg-neutral-900">Pending</option>
                      <option value="in-progress" className="bg-neutral-900">In Progress</option>
                      <option value="review" className="bg-neutral-900">Review</option>
                      <option value="delivered" className="bg-neutral-900">Delivered</option>
                      <option value="cancelled" className="bg-neutral-900">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="5000"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4a4155] focus:border-[#b98bff] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: "#9a8fb0" }}>
                      Delivery
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b98bff] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-xs text-center py-2">{error}</div>
                )}

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                  className="mt-2 px-6 py-3 rounded-full text-white font-bold text-sm disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #b98bff, #8b5cf6)",
                    boxShadow: "0 8px 24px rgba(185, 139, 255, 0.4)",
                  }}
                >
                  {saving ? "Creating..." : "Create Project"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}