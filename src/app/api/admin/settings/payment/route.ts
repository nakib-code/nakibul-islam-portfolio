import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import {
  getPaymentSettings,
  updatePaymentSettings,
} from "@/lib/payment-settings";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const settings = await getPaymentSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Admin get payment settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load payment settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "admin";

    const updated = await updatePaymentSettings(body, adminEmail);

    return NextResponse.json({
      success: true,
      message: "Payment settings updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Admin update payment settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update payment settings." },
      { status: 500 }
    );
  }
}
