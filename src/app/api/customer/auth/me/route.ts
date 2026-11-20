import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json({ success: true, user: null });
  }

  return NextResponse.json({
    success: true,
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      phone: session.phone,
    },
  });
}
