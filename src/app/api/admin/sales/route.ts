import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      approvedPayments,
      pendingPayments,
      totalCustomers,
      recentPendingPayments,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "PENDING_VERIFICATION" }),
      Order.countDocuments({ status: { $in: ["PAID", "COMPLETED"] } }),
      Payment.find({ status: "APPROVED" }).lean(),
      Payment.countDocuments({ status: "PENDING_VERIFICATION" }),
      User.countDocuments({ role: "customer" }),
      Payment.find({ status: "PENDING_VERIFICATION" })
        .sort({ submittedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalRevenueBdt = approvedPayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        paidOrders,
        pendingVerifications: pendingPayments,
        totalCustomers,
        totalRevenueBdt,
        recentPendingPayments,
      },
    });
  } catch (error) {
    console.error("Admin sales stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load sales statistics." },
      { status: 500 }
    );
  }
}
