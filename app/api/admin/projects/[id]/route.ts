import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Message from "@/lib/models/Message";
import FileAsset from "@/lib/models/FileAsset";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;
    const body = await req.json();

    const oldProject = await Project.findById(id);
    if (!oldProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Build update object — only include defined fields
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.deliveryDate !== undefined)
      updateData.deliveryDate = body.deliveryDate;
    if (body.thumbnailUrl !== undefined)
      updateData.thumbnailUrl = body.thumbnailUrl;

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // TypeScript-safe null check
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Failed to update project" },
        { status: 500 }
      );
    }

    // Log status change
    if (body.status && body.status !== oldProject.status) {
      try {
        const Activity = (await import("@/lib/models/Activity")).default;
        await Activity.create({
          projectId: project._id,
          userId: admin._id,
          userRole: "admin",
          type: "status-changed",
          text: `"${project.title}" moved to ${body.status}`,
        });
      } catch (e) {
        console.error("Failed to log activity:", e);
      }
    }

    return NextResponse.json({ success: true, project });
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

export async function DELETE(_req: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    await Promise.all([
      Message.deleteMany({ projectId: id }),
      FileAsset.deleteMany({ projectId: id }),
      Project.findByIdAndDelete(id),
    ]);

    return NextResponse.json({ success: true, message: "Deleted" });
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