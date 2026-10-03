import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import User from "@/lib/models/User";
import FileAsset from "@/lib/models/FileAsset";

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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file || !projectId) {
      return NextResponse.json(
        { success: false, error: "file and projectId are required" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: `atb-hub/${projectId}`,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        )
        .end(buffer);
    });

    const asset = await FileAsset.create({
      projectId,
      uploadedBy: user._id,
      uploadedByRole: user.role,
      fileName: file.name,
      fileUrl: result.secure_url,
      fileType: file.type,
      fileSize: file.size,
      publicId: result.public_id,
    });
    // Notify admins when a client uploads a file
if (user.role === "client") {
  try {
    const { sendPushToAdmins } = await import("@/lib/webPush");
    await sendPushToAdmins({
      title: "New file uploaded",
      body: `${user.name} uploaded "${file.name}"`,
      url: "/admin/files",
      tag: `file-${asset._id}`,
    });
  } catch (e) {
    console.error("Push notification failed:", e);
  }
}

    // Log activity
    try {
      const Activity = (await import("@/lib/models/Activity")).default;
      await Activity.create({
        projectId,
        userId: user._id,
        userRole: user.role,
        type: "file-uploaded",
        text:
          user.role === "admin"
            ? `Ateeb uploaded "${file.name}"`
            : `You uploaded "${file.name}"`,
      });
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    return NextResponse.json({ success: true, file: asset }, { status: 201 });
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