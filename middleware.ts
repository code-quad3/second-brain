import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PAGES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/widget).*)",
  ],
};
