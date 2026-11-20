import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Download from "@/models/Download";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { DOWNLOADS_DIR, getPrivateFilePath } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Download token is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Find Download Record
    const download = await Download.findOne({ token });
    if (!download) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired download link." },
        { status: 404 }
      );
    }

    if (download.expiresAt && download.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "This download link has expired." },
        { status: 403 }
      );
    }

    // 2. Security Check: Order MUST be PAID or COMPLETED
    const order = await Order.findById(download.orderId);
    if (!order || (order.status !== "PAID" && order.status !== "COMPLETED")) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment for this order has not been approved. Access denied.",
        },
        { status: 403 }
      );
    }

    // 3. Find Product
    const product = await Product.findById(download.productId);
    const productTitle = product?.title || download.productTitle || "website-template";
    const safeTitle = productTitle.replace(/[^a-zA-Z0-9_-]/g, "_");

    // 4. Record download audit in Download model
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    download.downloadCount += 1;
    download.lastDownloadedAt = new Date();
    download.ipAddress = clientIp;
    await download.save();

    // 5. Check if private ZIP file exists on disk
    let targetFilePath: string | null = null;
    if (product?.downloadFileName) {
      targetFilePath = getPrivateFilePath(product.downloadFileName);
    }
    if (!targetFilePath) {
      // Check for product slug zip in storage/downloads
      targetFilePath = getPrivateFilePath(`${product?.slug || safeTitle}.zip`);
    }

    // If a physical file exists in private storage, serve it
    if (targetFilePath && fs.existsSync(targetFilePath)) {
      const fileBuffer = fs.readFileSync(targetFilePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${safeTitle}-source-package.zip"`,
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    // Fallback: Generate template deliverable documentation and source manifest
    const manifestContent = `
==============================================================
   ${productTitle.toUpperCase()} - FULL SOURCE PACKAGE
==============================================================
Licensed to: ${order.customer.name} (${order.customer.email})
Order Number: #${order.orderNumber}
License: Single Commercial & Personal Use
Generated At: ${new Date().toISOString()}

Included Deliverables:
- Complete Next.js & React source code
- TypeScript definitions & Tailwind configuration
- Component library & assets
- Live Demo: ${product?.liveUrl || "https://nakivo.vercel.app/"}
- Documentation & Deployment Guide

Getting Started:
1. Extract this repository package.
2. Run 'npm install' to install dependencies.
3. Configure your environment variables in .env.local.
4. Run 'npm run dev' to launch local development server.

Support:
office.nakib@gmail.com | https://wa.me/8801700000000
Thank you for your purchase from Nakibul Islam Web Store!
==============================================================
`.trim();

    return new NextResponse(manifestContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeTitle}-package-manifest.txt"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Secure download error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process digital download." },
      { status: 500 }
    );
  }
}
