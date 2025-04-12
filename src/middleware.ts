import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const sessionlessPaths = ["/login", "/"];
  const protectedPaths = ["/chat"];
  const path = request.nextUrl.pathname;
  const cookie = request.cookies.get("session")?.name;

  if (protectedPaths.includes(path) && !cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionlessPaths.includes(path) && cookie) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
}
