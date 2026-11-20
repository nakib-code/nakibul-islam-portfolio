
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;

  let isAuthenticated = false;

  if (token && secret) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );

      isAuthenticated =
        typeof payload.email === "string" &&
        payload.role === "admin";
    } catch {
      isAuthenticated = false;
    }
  }

  if (pathname === "/auth/login" && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  if (pathname.startsWith("/admin") && !isAuthenticated) {
    const response = NextResponse.redirect(
      new URL("/auth/login", request.url)
    );

    if (token) {
      response.cookies.set({
        name: COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
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
