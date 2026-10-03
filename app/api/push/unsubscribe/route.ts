import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PushSubscription from "@/lib/models/PushSubscription";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "Endpoint required" },
        { status: 400 }
      );
    }

    await PushSubscription.deleteOne({ endpoint });

    return NextResponse.json({ success: true });
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