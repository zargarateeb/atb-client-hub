import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const query: Record<string, unknown> = {};
    if (projectId) query.projectId = projectId;

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .populate("senderId", "name email role")
      .lean();

    return NextResponse.json({ success: true, messages });
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

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { projectId, text } = body;

    if (!projectId || !text?.trim()) {
      return NextResponse.json(
        { success: false, error: "projectId and text are required" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      projectId,
      senderId: user._id,
      senderRole: user.role,
      text: text.trim(),
      read: false,
    });

    // Log activity
    try {
      const Activity = (await import("@/lib/models/Activity")).default;
      await Activity.create({
        projectId,
        userId: user._id,
        userRole: user.role,
        type: "message-sent",
        text:
          user.role === "admin"
            ? `Ateeb replied to your message`
            : `You sent a message`,
      });
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    const populated = await message.populate("senderId", "name email role");

    return NextResponse.json(
      { success: true, message: populated },
      { status: 201 }
    );
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