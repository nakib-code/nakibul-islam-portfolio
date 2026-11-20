
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

function uploadToCloudinary(
  buffer: Buffer
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "web-store",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url || !result.public_id) {
          reject(new Error("Invalid Cloudinary upload result"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.on("error", reject);
    stream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);

  if (denied) {
    return denied;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Image file is required." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, message: "The image file is empty." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Maximum image size is 5 MB." },
        { status: 413 }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type as (typeof ALLOWED_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG and WebP images are allowed.",
        },
        { status: 415 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const isJpeg =
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;

    const isPng =
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([
          0x89, 0x50, 0x4e, 0x47,
          0x0d, 0x0a, 0x1a, 0x0a,
        ])
      );

    const isWebp =
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";

    const validSignature =
      (file.type === "image/jpeg" && isJpeg) ||
      (file.type === "image/png" && isPng) ||
      (file.type === "image/webp" && isWebp);

    if (!validSignature) {
      return NextResponse.json(
        {
          success: false,
          message: "The file content does not match its image type.",
        },
        { status: 400 }
      );
    }

    const uploaded = await uploadToCloudinary(buffer);

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully.",
        data: {
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
