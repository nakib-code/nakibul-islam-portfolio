import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import Download from "@/models/Download";
import {
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail,
} from "@/lib/email";

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
        { transactionId: { $regex: query, $options: "i" } },
        { orderNumber: { $regex: query, $options: "i" } },
        { "customer.name": { $regex: query, $options: "i" } },
        { "customer.email": { $regex: query, $options: "i" } },
        { bkashSenderNumber: { $regex: query, $options: "i" } },
      ];
    }

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Admin fetch payments error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const paymentId = typeof body.paymentId === "string" ? body.paymentId.trim() : "";
    const action = body.action; // "approve" | "reject"
    const rejectionReason = typeof body.rejectionReason === "string" ? body.rejectionReason.trim() : "";

    if (!paymentId || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { success: false, message: "Payment ID and valid action (approve/reject) are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found." },
        { status: 404 }
      );
    }

    const order = await Order.findById(payment.orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Associated order not found." },
        { status: 404 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin";

    if (action === "approve") {
      payment.status = "APPROVED";
      payment.verifiedBy = adminEmail;
      payment.verifiedAt = new Date();
      payment.rejectionReason = "";
      await payment.save();

      order.status = "PAID";
      await order.save();

      // Generate secure download access tokens in Download model
      for (const item of order.items) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year access

        await Download.findOneAndUpdate(
          { orderId: order._id, productId: item.productId },
          {
            orderId: order._id,
            productId: item.productId,
            productTitle: item.title,
            customerEmail: order.customer.email,
            token,
            expiresAt,
            downloadCount: 0,
          },
          { upsert: true, new: true }
        );
      }

      // Email customer
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      void sendPaymentApprovedEmail({
        to: order.customer.email,
        customerName: order.customer.name,
        orderNumber: order.orderNumber,
        amountBdt: payment.amount,
        downloadUrl: `${appUrl}/web-store/purchased?orderId=${order._id}`,
        items: order.items.map((it) => ({ title: it.title })),
      });

      return NextResponse.json({
        success: true,
        message: `Payment for Order #${order.orderNumber} successfully approved. Downloads unlocked.`,
        data: payment,
      });
    } else {
      // Reject action
      payment.status = "REJECTED";
      payment.rejectionReason = rejectionReason || "Transaction details could not be verified in bKash statement.";
      payment.verifiedBy = adminEmail;
      payment.verifiedAt = new Date();
      await payment.save();

      order.status = "CANCELLED";
      await order.save();

      // Email customer
      void sendPaymentRejectedEmail({
        to: order.customer.email,
        customerName: order.customer.name,
        orderNumber: order.orderNumber,
        rejectionReason: payment.rejectionReason,
      });

      return NextResponse.json({
        success: true,
        message: `Payment for Order #${order.orderNumber} has been rejected.`,
        data: payment,
      });
    }
  } catch (error) {
    console.error("Admin verify payment error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update payment status." },
      { status: 500 }
    );
  }
}
