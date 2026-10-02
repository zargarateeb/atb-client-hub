import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Message from "@/lib/models/Message";
import FileAsset from "@/lib/models/FileAsset";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await User.findOne({
      email: session.user.email.toLowerCase(),
    });
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const [totalClients, totalProjects, activeProjects, deliveredProjects, unreadMessages, totalFiles] =
      await Promise.all([
        User.countDocuments({ role: "client" }),
        Project.countDocuments({}),
        Project.countDocuments({
          status: { $in: ["pending", "in-progress", "review"] },
        }),
        Project.countDocuments({ status: "delivered" }),
        Message.countDocuments({ senderRole: "client", read: false }),
        FileAsset.countDocuments({}),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalClients,
        totalProjects,
        activeProjects,
        deliveredProjects,
        unreadMessages,
        totalFiles,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}