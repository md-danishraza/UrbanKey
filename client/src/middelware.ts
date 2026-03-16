import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/properties(.*)",
  "/about",
  "/contact",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/api/webhook(.*)", // Webhooks for Clerk/Stripe/etc.
]);

// 2. Define auth routes (login/register pages)
const isAuthRoute = createRouteMatcher([
  "/auth/login(.*)",
  "/auth/register(.*)",
]);

// 3. Define role-specific protected routes
const isTenantRoute = createRouteMatcher([
  "/tenant(.*)",
  "/wishlist(.*)",
  "/visits(.*)",
]);

const isLandlordRoute = createRouteMatcher([
  "/landlord(.*)",
  "/properties/new(.*)",
  "/properties/edit(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/verifications(.*)",
  "/analytics(.*)",
]);

// 4. Onboarding routes (require auth but special handling)
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

// 5. API routes that need protection
const isApiRoute = createRouteMatcher([
  "/api/protected(.*)",
  "/api/users/me(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  // Get user role from Clerk metadata (set during onboarding)
  const role =
    sessionClaims?.metadata?.role ||
    sessionClaims?.publicMetadata?.role ||
    "tenant"; // Default to tenant if not set

  // Redirect authenticated users away from auth pages
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow access to onboarding routes for authenticated users
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  if (!userId && !isPublicRoute(req)) {
    // Store the original URL to redirect back after login
    const signInUrl = new URL("/auth/login", req.url);
    signInUrl.searchParams.set("redirect_url", url.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Role-based access control for authenticated users
  if (userId) {
    // Check tenant routes
    if (isTenantRoute(req) && role !== "tenant" && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Check landlord routes
    if (isLandlordRoute(req) && role !== "landlord" && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Check admin routes
    if (isAdminRoute(req) && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Check if user is verified for certain actions
    const isVerified = sessionClaims?.metadata?.isVerified || false;

    // Landlords need verification to list properties
    if (
      req.nextUrl.pathname.includes("/properties/new") &&
      role === "landlord" &&
      !isVerified
    ) {
      return NextResponse.redirect(new URL("/verification-pending", req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
