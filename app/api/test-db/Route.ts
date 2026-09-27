import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: "atbhub DB connected successfully ✅",
      database: "atbhub",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "DB connection failed ❌",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}