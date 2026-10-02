import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Message from "@/lib/models/Message";

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
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's projects
    const userProjects = await Project.find({ clientId: user._id }).lean();
    const projectIds = userProjects.map((p) => p._id);

    const [activeProjects, deliveredProjects, unreadMessages] = await Promise.all([
      Project.countDocuments({
        clientId: user._id,
        status: { $in: ["pending", "in-progress", "review"] },
      }),
      Project.countDocuments({ clientId: user._id, status: "delivered" }),
      Message.countDocuments({
        projectId: { $in: projectIds },
        senderRole: "admin",
        read: false,
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        activeProjects,
        deliveredProjects,
        unreadMessages,
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