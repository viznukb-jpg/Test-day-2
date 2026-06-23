import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/rooms") ||
    request.nextUrl.pathname.startsWith("/bookings");

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  if (request.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/rooms/:path*", "/bookings/:path*", "/login", "/register"],
};
