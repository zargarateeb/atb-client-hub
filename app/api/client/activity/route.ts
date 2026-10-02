import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Activity from "@/lib/models/Activity";

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

    // Get user's project IDs
    const projects = await Project.find({ clientId: user._id }).select("_id").lean();
    const projectIds = projects.map((p) => p._id);

    // Fetch activity for these projects OR where user is the actor
    const activities = await Activity.find({
      $or: [
        { projectId: { $in: projectIds } },
        { userId: user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, activities });
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