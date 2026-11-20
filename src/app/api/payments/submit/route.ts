import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { getPaymentSettings } from "@/lib/payment-settings";
import {
  sendPaymentSubmittedEmail,
  sendAdminNewPaymentNotification,
} from "@/lib/email";

export const runtime = "nodejs";

// In-memory rate limiting map: IP -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= MAX_ATTEMPTS) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many payment submission attempts. Please try again in a few minutes.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    const bkashSenderNumber =
      typeof body.bkashSenderNumber === "string"
        ? body.bkashSenderNumber.trim()
        : "";
    const rawTransactionId =
      typeof body.transactionId === "string" ? body.transactionId.trim() : "";
    const amount = Number(body.amount);

    if (!orderId || !bkashSenderNumber || !rawTransactionId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order ID, sender bKash number, and Transaction ID (TrxID) are required.",
        },
        { status: 400 }
      );
    }

    const transactionId = rawTransactionId.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (transactionId.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid bKash Transaction ID (minimum 6 characters).",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch Order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (order.status === "PAID" || order.status === "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          message: "This order is already marked as paid and verified.",
        },
        { status: 400 }
      );
    }

    // 2. Fetch current active bKash settings
    const settings = await getPaymentSettings();
    const bkashReceiverNumber = settings.bkashNumber;

    // 3. DUPLICATE TRANSACTION PREVENTION: Check across all payments
    const existingPaymentWithTrx = await Payment.findOne({
      transactionId,
    });
    if (existingPaymentWithTrx) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This Transaction ID has already been submitted in the system. Duplicate submissions are not allowed.",
        },
        { status: 409 }
      );
    }

    // 4. Check if a payment already exists for this order
    let payment = await Payment.findOne({ orderId: order._id });
    if (payment) {
      if (payment.status === "APPROVED") {
        return NextResponse.json(
          { success: false, message: "Payment for this order has already been approved." },
          { status: 400 }
        );
      }
      // Update existing pending or rejected record with new attempt
      payment.bkashSenderNumber = bkashSenderNumber;
      payment.bkashReceiverNumber = bkashReceiverNumber;
      payment.transactionId = transactionId;
      payment.amount = amount > 0 ? amount : order.totalAmountBdt;
      payment.status = "PENDING_VERIFICATION";
      payment.rejectionReason = "";
      payment.submittedAt = new Date();
      await payment.save();
    } else {
      // Create new Payment record
      payment = await Payment.create({
        orderId: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        paymentMethod: "bKash",
        bkashSenderNumber,
        bkashReceiverNumber,
        transactionId,
        amount: amount > 0 ? amount : order.totalAmountBdt,
        status: "PENDING_VERIFICATION",
        submittedAt: new Date(),
      });
    }

    // 5. Update Order status
    order.status = "PENDING_VERIFICATION";
    order.paymentId = payment._id;
    await order.save();

    // 6. Asynchronous email notifications (non-blocking)
    void sendPaymentSubmittedEmail({
      to: order.customer.email,
      customerName: order.customer.name,
      orderNumber: order.orderNumber,
      amountBdt: payment.amount,
      transactionId: payment.transactionId,
    });

    void sendAdminNewPaymentNotification({
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      amountBdt: payment.amount,
      transactionId: payment.transactionId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment submitted successfully! Your payment is now pending manual verification.",
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        status: payment.status,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit payment information." },
      { status: 500 }
    );
  }
}
