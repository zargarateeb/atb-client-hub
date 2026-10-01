import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";

const SEED_PROJECTS = [
  {
    title: "Brand Motion Edit — Swiggy",
    description: "30-second brand motion piece for Swiggy's new campaign",
    status: "in-progress" as const,
    price: 15000,
    deliveryDaysFromNow: 5,
  },
  {
    title: "SaaS Explainer — DeepSeek AI",
    description: "60-second product explainer animation",
    status: "review" as const,
    price: 22000,
    deliveryDaysFromNow: 3,
  },
  {
    title: "Short Form Series — Spotify",
    description: "10-part vertical short form series for Spotify India",
    status: "in-progress" as const,
    price: 45000,
    deliveryDaysFromNow: 8,
  },
  {
    title: "Podcast Intro — The Ranveer Show",
    description: "Animated intro + transitions package",
    status: "delivered" as const,
    price: 8000,
    deliveryDaysFromNow: -4,
  },
  {
    title: "Gym Reel — Fitness Influencer",
    description: "Hardcore gym edit for Instagram Reels",
    status: "delivered" as const,
    price: 3500,
    deliveryDaysFromNow: -10,
  },
];

export async function POST() {
  try {
    await connectDB();

    // Find the admin user
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json(
        { success: false, error: "ADMIN_EMAIL not set" },
        { status: 400 }
      );
    }

    const admin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Admin user not found. Run POST /api/seed-admin first.",
        },
        { status: 404 }
      );
    }

    // Clear existing projects for this admin
    await Project.deleteMany({ clientId: admin._id });

    // Seed fresh projects
    const created = await Promise.all(
      SEED_PROJECTS.map((p) => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + p.deliveryDaysFromNow);

        return Project.create({
          clientId: admin._id,
          title: p.title,
          description: p.description,
          status: p.status,
          price: p.price,
          deliveryDate,
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} projects for admin ✅`,
      count: created.length,
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