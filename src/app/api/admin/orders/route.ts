import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.trim();

    const filter: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      filter.status = status;
    }
    if (query) {
      filter.$or = [
        { orderNumber: { $regex: query, $options: "i" } },
        { "customer.name": { $regex: query, $options: "i" } },
        { "customer.email": { $regex: query, $options: "i" } },
        { "customer.phone": { $regex: query, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("paymentId")
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
