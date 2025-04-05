import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const protectedPaths = "/chat";
  const cookie = request.cookies.get("session")?.name;

  if (request.nextUrl.pathname.includes(protectedPaths) && !cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
