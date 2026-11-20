import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID or order number is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { orderNumber: id.toUpperCase() }] }
      : { orderNumber: id.toUpperCase() };

    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Also fetch associated payment if available
    const payment = await Payment.findOne({ orderId: order._id }).lean();

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        payment: payment || null,
      },
    });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load order." },
      { status: 500 }
    );
  }
}
