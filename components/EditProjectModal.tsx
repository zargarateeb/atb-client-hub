"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "review" | "delivered" | "cancelled";
  price?: number;
  deliveryDate?: string;
  thumbnailUrl?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  project: Project | null;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  onSaved,
  project,
}: EditProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && project) {
      setTitle(project.title);
      setDescription(project.description || "");
      setStatus(project.status);
      setPrice(project.price?.toString() || "");
      setDeliveryDate(
        project.deliveryDate
          ? new Date(project.deliveryDate).toISOString().split("T")[0]
          : ""
      );
      setThumbnailUrl(project.thumbnailUrl || "");
      setError("");
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${project._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          price: price ? Number(price) : undefined,
          deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : undefined,
          thumbnailUrl: thumbnailUrl || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
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
                Edit Project
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    className="block text-xs mb-1.5 font-medium"
                    style={{ color: "#9a8fb0" }}
                  >
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b98bff] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs mb-1.5 font-medium"
                    style={{ color: "#9a8fb0" }}
                  >
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://ik.imagekit.io/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4a4155] focus:border-[#b98bff] focus:outline-none text-sm"
                  />
                  <p className="text-[10px] mt-1" style={{ color: "#4a4155" }}>
                    Leave empty to use initials-based thumbnail.
                  </p>
                </div>

                {thumbnailUrl && (
                  <div
                    className="w-full h-24 rounded-xl overflow-hidden"
                    style={{ background: "rgba(15, 8, 25, 0.7)" }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div>
                  <label
                    className="block text-xs mb-1.5 font-medium"
                    style={{ color: "#9a8fb0" }}
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b98bff] focus:outline-none text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label
                      className="block text-xs mb-1.5 font-medium"
                      style={{ color: "#9a8fb0" }}
                    >
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
                    <label
                      className="block text-xs mb-1.5 font-medium"
                      style={{ color: "#9a8fb0" }}
                    >
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b98bff] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs mb-1.5 font-medium"
                      style={{ color: "#9a8fb0" }}
                    >
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
                  <div className="text-red-400 text-xs text-center py-2">
                    {error}
                  </div>
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
                  {saving ? "Saving..." : "Save Changes"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}