import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isLandlordRoute = path.startsWith("/landlord");
  const isTenantRoute = path.startsWith("/tenant");
  const isAdminRoute = path.startsWith("/admin");
  const isAuthRoute = path.startsWith("/auth");

  // Public routes
  if (
    path === "/" ||
    path.startsWith("/properties") ||
    path.startsWith("/about") ||
    path.startsWith("/contact")
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(path));
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (isLandlordRoute && token.role !== "landlord" && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isTenantRoute && token.role !== "tenant" && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/landlord/:path*",
    "/tenant/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/properties/:path*",
  ],
};
