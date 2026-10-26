
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import cloudinary from "@/lib/cloudinary";
import Project from "@/models/Project";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

const ALLOWED_FIELDS = [
  "title",
  "slug",
  "description",
  "category",
  "price",
  "techStack",
  "liveUrl",
  "whatsappMessage",
] as const;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidWebUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const isValidCloudinaryPublicId = (value: unknown): value is string =>
  typeof value === "string" &&
  value.startsWith("web-store/") &&
  value.length > "web-store/".length &&
  !value.includes("..");

async function deleteCloudinaryImage(publicId: string) {
  if (!isValidCloudinaryPublicId(publicId)) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (result.result === "ok" || result.result === "not found") {
      return true;
    }

    console.error("Cloudinary image cleanup failed:", result);
    return false;
  } catch (error) {
    console.error("Cloudinary image cleanup failed:", error);
    return false;
  }
}

// PATCH: Update a project
export async function PATCH(request: NextRequest, context: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    // Update only explicitly allowed fields.
    for (const field of ALLOWED_FIELDS) {
      const value = data[field];

      if (value === undefined) continue;

      if (field === "price") {
        if (
          typeof value !== "number" ||
          !Number.isFinite(value) ||
          value < 0
        ) {
          return NextResponse.json(
            { success: false, message: "Invalid price" },
            { status: 400 }
          );
        }

        project.price = value;
        continue;
      }

      if (field === "techStack") {
        const stack =
          Array.isArray(value)
            ? value
            : typeof value === "string"
              ? value.split(",")
              : null;

        if (
          !stack ||
          !stack.every((item: unknown) => typeof item === "string")
        ) {
          return NextResponse.json(
            { success: false, message: "Invalid tech stack" },
            { status: 400 }
          );
        }

        project.techStack = stack
          .map((item: string) => item.trim())
          .filter(Boolean);

        continue;
      }

      if (!isNonEmptyString(value)) {
        return NextResponse.json(
          { success: false, message: `Invalid ${field}` },
          { status: 400 }
        );
      }

      const trimmed = value.trim();

      if (field === "slug" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug must contain only letters, numbers and hyphens",
          },
          { status: 400 }
        );
      }

      if (field === "liveUrl" && !isValidWebUrl(trimmed)) {
        return NextResponse.json(
          { success: false, message: "Invalid live URL" },
          { status: 400 }
        );
      }

      project.set(
        field,
        field === "slug" ? trimmed.toLowerCase() : trimmed
      );
    }

    // Update the image only when both values are provided together.
    const hasImageUrl = data.imageUrl !== undefined;
    const hasPublicId = data.imagePublicId !== undefined;

    if (hasImageUrl !== hasPublicId) {
      return NextResponse.json(
        {
          success: false,
          message: "Both imageUrl and imagePublicId are required to update the image",
        },
        { status: 400 }
      );
    }

    const oldPublicId = project.imagePublicId;
    let imageChanged = false;

    if (hasImageUrl && hasPublicId) {
      const imageUrl = data.imageUrl;
      const publicId = data.imagePublicId;

      if (
        !isNonEmptyString(imageUrl) ||
        !imageUrl.startsWith("https://") ||
        !isValidCloudinaryPublicId(publicId)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "A valid uploaded Cloudinary image is required",
          },
          { status: 400 }
        );
      }

      // Prevent changing the image to an arbitrary external URL.
      let parsedImageUrl: URL;

      try {
        parsedImageUrl = new URL(imageUrl);
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid image URL" },
          { status: 400 }
        );
      }

      if (
        parsedImageUrl.hostname !== "res.cloudinary.com" ||
        !parsedImageUrl.pathname.includes("/web-store/")
      ) {
        return NextResponse.json(
          { success: false, message: "Image must be hosted in the web-store Cloudinary folder" },
          { status: 400 }
        );
      }

      imageChanged =
        imageUrl !== project.imageUrl ||
        publicId !== oldPublicId;

      project.imageUrl = imageUrl;
      project.imagePublicId = publicId;
    }

    await project.save();

    // Clean up the old image only after the database update succeeds.
    let imageCleanupWarning = false;

    if (
      imageChanged &&
      oldPublicId &&
      oldPublicId !== project.imagePublicId
    ) {
      imageCleanupWarning = !(await deleteCloudinaryImage(oldPublicId));
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project updated successfully",
      imageCleanupWarning,
    });
  } catch (error) {
    console.error("Update project error:", error);

    if (
      error instanceof mongoose.Error.ValidationError ||
      (error as { code?: number })?.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            (error as { code?: number }).code === 11000
              ? "A project with this slug already exists"
              : "Project validation failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a project
export async function DELETE(request: NextRequest, context: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Delete the database record first.
    await Project.findByIdAndDelete(id);

    let imageCleanupWarning = false;

    if (project.imagePublicId) {
      imageCleanupWarning = !(await deleteCloudinaryImage(
        project.imagePublicId
      ));
    } else {
      // Legacy project without a saved Cloudinary public ID.
      imageCleanupWarning = true;
    }

    return NextResponse.json({
      success: true,
      message: imageCleanupWarning
        ? "Project deleted, but image cleanup needs attention"
        : "Project and image deleted successfully",
      imageCleanupWarning,
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
