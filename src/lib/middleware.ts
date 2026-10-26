
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  const loginUrl = new URL("/auth/login", request.url);
  const dashboardUrl = new URL("/admin/dashboard", request.url);

  const jwtSecret = process.env.JWT_SECRET;

  // JWT_SECRET must be configured
  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured");

    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Verify the admin token
  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect authenticated admin away from the login page
  if (pathname === "/auth/login" && isAuthenticated) {
    return NextResponse.redirect(dashboardUrl);
  }

  // Protect all admin pages
  if (pathname.startsWith("/admin") && !isAuthenticated) {
    const response = NextResponse.redirect(loginUrl);

    // Clear an invalid or expired token
    if (token) {
      response.cookies.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
