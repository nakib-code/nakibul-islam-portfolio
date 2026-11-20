import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Download from "@/models/Download";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCustomerSession } from "@/lib/customer-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const session = await getCustomerSession(request);

    let customerEmail = session?.email;

    await connectDB();

    // If orderId is provided, verify the order is paid
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && (order.status === "PAID" || order.status === "COMPLETED")) {
        customerEmail = order.customer.email;
      } else if (!customerEmail) {
        return NextResponse.json(
          { success: false, message: "Order not found or payment not approved." },
          { status: 403 }
        );
      }
    }

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, message: "Please sign in or provide a valid order ID." },
        { status: 401 }
      );
    }

    // Fetch all active downloads for this customer
    const downloads = await Download.find({
      customerEmail: customerEmail.toLowerCase().trim(),
    })
      .sort({ createdAt: -1 })
      .lean();

    // Attach product and order information
    const items = await Promise.all(
      downloads.map(async (dl) => {
        const [product, order] = await Promise.all([
          Product.findById(dl.productId).lean(),
          Order.findById(dl.orderId).lean(),
        ]);

        return {
          downloadId: dl._id,
          token: dl.token,
          expiresAt: dl.expiresAt,
          downloadCount: dl.downloadCount,
          lastDownloadedAt: dl.lastDownloadedAt,
          orderNumber: order?.orderNumber || "N/A",
          orderDate: order?.createdAt || dl.createdAt,
          product: product
            ? {
                _id: product._id,
                title: product.title,
                slug: product.slug,
                category: product.category,
                imageUrl: product.imageUrl,
                liveUrl: product.liveUrl,
                price: product.price,
              }
            : {
                title: dl.productTitle,
                category: "Website Template",
              },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Fetch purchases error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load purchased products." },
      { status: 500 }
    );
  }
}
