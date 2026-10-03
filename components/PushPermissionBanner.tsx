"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export default function PushPermissionBanner() {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check browser support
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPermission("unsupported");
      return;
    }

    // Check current permission state
    setPermission(Notification.permission as PermissionState);

    // Check if user dismissed before
    const dismissedFlag = localStorage.getItem("push-banner-dismissed");
    if (dismissedFlag === "true") setDismissed(true);
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      // 1. Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm as PermissionState);

      if (perm !== "granted") {
        setLoading(false);
        return;
      }

      // 2. Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Subscribe to push
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error("VAPID public key missing");
        setLoading(false);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // 4. Send subscription to server
      const subJson = subscription.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setDismissed(true), 2000);
      }
    } catch (err) {
      console.error("Push subscription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("push-banner-dismissed", "true");
    setDismissed(true);
  };

  // Don't show if unsupported, already granted, or dismissed
  if (
    permission === "unsupported" ||
    permission === "granted" ||
    permission === "denied" ||
    dismissed
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 p-4 rounded-2xl glass flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(185, 139, 255, 0.15)",
              border: "1px solid rgba(185, 139, 255, 0.3)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e3c8ff"
              strokeWidth="1.8"
              className="w-5 h-5"
            >
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </div>
          <div className="min-w-0">
            {success ? (
              <>
                <p className="text-[13px] font-bold text-white">
                  Notifications enabled ✓
                </p>
                <p className="text-[11px]" style={{ color: "#9a8fb0" }}>
                  You&apos;ll get updates about your projects.
                </p>
              </>
            ) : (
              <>
                <p className="text-[13px] font-bold text-white">
                  Enable notifications
                </p>
                <p className="text-[11px]" style={{ color: "#9a8fb0" }}>
                  Get notified when messages, files, or updates land.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!success && (
            <button
              onClick={handleEnable}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #e3c8ff, #b98bff)",
                color: "#1c0a33",
              }}
            >
              {loading ? "..." : "Enable"}
            </button>
          )}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "#6a5f7c" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}