import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isOnLogin = req.nextUrl.pathname === "/admin/login";

  if (isOnAdmin && !isOnLogin && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isOnLogin && isLoggedIn) {
    const dashUrl = new URL("/admin", req.nextUrl.origin);
    return NextResponse.redirect(dashUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
