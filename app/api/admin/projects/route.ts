import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";

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
    const admin = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { clientEmail, clientName, title, description, status, price, deliveryDate } = body;

    if (!clientEmail || !title) {
      return NextResponse.json(
        { success: false, error: "clientEmail and title are required" },
        { status: 400 }
      );
    }

    // Find or create client
    let client = await User.findOne({ email: clientEmail.toLowerCase() });
    if (!client) {
      client = await User.create({
        email: clientEmail.toLowerCase(),
        name: clientName || clientEmail.split("@")[0],
        role: "client",
        active: true,
      });
    }

    const project = await Project.create({
      clientId: client._id,
      title,
      description: description || "",
      status: status || "pending",
      price: price ? Number(price) : undefined,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    });

    return NextResponse.json({ success: true, project, client }, { status: 201 });
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