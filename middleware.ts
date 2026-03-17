import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const AUTH_PAGES = ["/login", "/register"];

export default auth((req: any) => {
  const { pathname } = req.nextUrl;
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const token = req.auth;

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/widget|_next/data).*)",
  ],
};
