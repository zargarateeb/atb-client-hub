import webpush from "web-push";
import mongoose from "mongoose";
import PushSubscription from "@/lib/models/PushSubscription";

// Configure web-push once
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const email = process.env.VAPID_EMAIL || "mailto:visuals.atb@gmail.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(email, publicKey, privateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string; // where to redirect on click
  tag?: string; // groups notifications
  icon?: string;
}

/**
 * Send a push notification to a specific user
 */
export async function sendPushToUser(
  userId: mongoose.Types.ObjectId | string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  try {
    const subscriptions = await PushSubscription.find({ userId });

    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const notifications = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            url: payload.url || "/",
            tag: payload.tag || "default",
            icon:
              payload.icon ||
              "https://ik.imagekit.io/5xwchyocd7/ATB-logo.png",
          })
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        // If subscription is expired/invalid, remove it
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await PushSubscription.deleteOne({ _id: sub._id });
        }
      }
    });

    await Promise.all(notifications);

    return { sent, failed };
  } catch (err) {
    console.error("sendPushToUser error:", err);
    return { sent, failed };
  }
}

/**
 * Send a push notification to all admins
 */
export async function sendPushToAdmins(
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  try {
    const { default: User } = await import("@/lib/models/User");
    const admins = await User.find({ role: "admin" }).select("_id");

    let totalSent = 0;
    let totalFailed = 0;

    await Promise.all(
      admins.map(async (admin) => {
        const { sent, failed } = await sendPushToUser(admin._id, payload);
        totalSent += sent;
        totalFailed += failed;
      })
    );

    return { sent: totalSent, failed: totalFailed };
  } catch (err) {
    console.error("sendPushToAdmins error:", err);
    return { sent: 0, failed: 0 };
  }
}