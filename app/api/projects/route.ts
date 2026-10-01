import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// GET — list projects for the logged-in client
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

    // Find user
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Admins see all projects, clients see only their own
    const query = user.role === "admin" ? {} : { clientId: user._id };

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, projects });
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

// POST — create a project (admin only)
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

    const user = await User.findOne({ email: session.user.email.toLowerCase() });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { clientId, title, description, status, price, deliveryDate } = body;

    if (!clientId || !title) {
      return NextResponse.json(
        { success: false, error: "clientId and title are required" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      clientId,
      title,
      description: description || "",
      status: status || "pending",
      price,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
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