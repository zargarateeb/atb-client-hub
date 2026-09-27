import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    if (!email) {
      return NextResponse.json(
        { success: false, error: "ADMIN_EMAIL not set in .env.local" },
        { status: 400 }
      );
    }

    // Check if admin exists
    let admin = await User.findOne({ email: email.toLowerCase() });

    if (admin) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists",
        user: admin,
      });
    }

    admin = await User.create({
      email: email.toLowerCase(),
      name: "Ateeb",
      role: "admin",
      active: true,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created ✅",
      user: admin,
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