import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Отримуємо куку сесії
  const session = request.cookies.get("session")?.value;

  // Визначаємо які роути захищені
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/rooms") ||
    request.nextUrl.pathname.startsWith("/bookings");

  // Визначаємо роути авторизації (щоб не пускати туди залогінених юзерів)
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // Якщо роут захищений, а сесії немає - редірект на логін
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Якщо юзер вже залогінений, а намагається зайти на логін/реєстрацію - редірект на /rooms
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  // Якщо юзер авторизований, перенаправляємо з головної сторінки на /rooms
  if (request.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  return NextResponse.next();
}

// Вказуємо, для яких роутів має спрацьовувати middleware
export const config = {
  matcher: ["/", "/rooms/:path*", "/bookings/:path*", "/login", "/register"],
};

