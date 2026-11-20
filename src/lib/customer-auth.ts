import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

export const CUSTOMER_COOKIE_NAME = "customer_session";

function getSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "bkash-customer-fallback-secret-2026-secure";
  return new TextEncoder().encode(secret);
}

export interface CustomerSessionPayload {
  userId?: string;
  email: string;
  name: string;
  phone?: string;
  role: "customer";
}

export async function signCustomerToken(payload: CustomerSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyCustomerSession(
  token: string
): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.email === "string" && payload.role === "customer") {
      return {
        userId: payload.userId as string | undefined,
        email: payload.email,
        name: (payload.name as string) || "Customer",
        phone: payload.phone as string | undefined,
        role: "customer",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCustomerSession(
  request: NextRequest
): Promise<CustomerSessionPayload | null> {
  const token = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerSession(token);
}
