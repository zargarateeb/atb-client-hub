import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
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

    const clients = await User.find({ role: "client" }).lean();

    const clientsWithCounts = await Promise.all(
      clients.map(async (client) => {
        const projectCount = await Project.countDocuments({
          clientId: client._id,
        });
        return { ...client, projectCount };
      })
    );

    return NextResponse.json({ success: true, clients: clientsWithCounts });
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