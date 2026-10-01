import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Message from "@/lib/models/Message";
import Project from "@/lib/models/Project";

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

    // Get all projects with their clients
    const projects = await Project.find()
      .populate("clientId", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    // For each project, get the latest message + unread count
    const threads = await Promise.all(
      projects.map(async (project) => {
        const messages = await Message.find({ projectId: project._id })
          .sort({ createdAt: -1 })
          .limit(1)
          .populate("senderId", "name role")
          .lean();

        const unreadCount = await Message.countDocuments({
          projectId: project._id,
          senderRole: "client",
          read: false,
        });

        return {
          project: {
            _id: project._id.toString(),
            title: project.title,
            status: project.status,
          },
          client: project.clientId,
          latestMessage: messages[0] || null,
          unreadCount,
        };
      })
    );

    return NextResponse.json({ success: true, threads });
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