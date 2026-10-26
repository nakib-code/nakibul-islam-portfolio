
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Fetch projects error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();

    const {
      title,
      slug,
      description,
      category,
      price,
      techStack,
      liveUrl,
      imageUrl,
      whatsappMessage,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      typeof imageUrl !== "string" ||
      !imageUrl.startsWith("https://")
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide valid project details and an image URL" },
        { status: 400 }
      );
    }

    const techArray = Array.isArray(techStack)
      ? techStack.filter(
          (item: unknown): item is string =>
            typeof item === "string" && Boolean(item.trim())
        )
      : typeof techStack === "string"
        ? techStack.split(",").map((item: string) => item.trim()).filter(Boolean)
        : [];

    const newProject = await Project.create({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      techStack: techArray,
      liveUrl: typeof liveUrl === "string" ? liveUrl.trim() : "",
      imageUrl,
      whatsappMessage:
        typeof whatsappMessage === "string" ? whatsappMessage.trim() : "",
    });

    return NextResponse.json(
      { success: true, data: newProject },
      { status: 201 }
    );
  } catch (error: unknown) {
    const mongoError = error as { code?: number };

    if (mongoError.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This project slug already exists" },
        { status: 409 }
      );
    }

    console.error("Create project error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}
