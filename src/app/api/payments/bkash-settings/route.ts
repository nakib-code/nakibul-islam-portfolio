import { NextResponse } from "next/server";
import { getPaymentSettings } from "@/lib/payment-settings";

export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await getPaymentSettings();
    return NextResponse.json({
      success: true,
      data: {
        bkashNumber: settings.bkashNumber,
        accountType: settings.accountType,
        instructions: settings.instructions,
        instructionsBn: settings.instructionsBn,
        isEnabled: settings.isEnabled,
        bdtRate: settings.bdtRate,
      },
    });
  } catch (error) {
    console.error("Failed to load bKash settings:", error);
    return NextResponse.json(
      { success: false, message: "Could not load payment settings." },
      { status: 500 }
    );
  }
}
