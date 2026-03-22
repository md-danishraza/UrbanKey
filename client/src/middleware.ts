import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(",") || [];

// 1. Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/properties(.*)",
  "/about",
  "/contact",
  "/faqs",
  "/terms",
  "/privacy",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/api/webhook(.*)", // Webhooks for Clerk/Stripe/etc.
]);

// 2. Define auth routes (login/register pages)
const isAuthRoute = createRouteMatcher([
  "/auth/login(.*)",
  "/auth/register(.*)",
]);

// 3. Define role-specific protected routes (require specific roles)
const isTenantRoute = createRouteMatcher(["/tenant(.*)"]);
const isLandlordRoute = createRouteMatcher(["/landlord(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// 4. Onboarding routes
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // console.log(sessionClaims);

  // 1. Redirect authenticated users away from auth pages
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Protect all non-public routes (Force sign-in)
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 3. For authenticated users, handle role-based access
  if (userId) {
    const metadata =
      (sessionClaims?.publicMetadata as Record<string, any>) || {};
    const role = (metadata.role as string)?.toLowerCase() || "tenant";

    // Handle onboarding routes - allow access regardless of completion status
    if (isOnboardingRoute(req)) {
      const onboardingRole = req.nextUrl.pathname.split("/")[2];

      // Redirect to correct onboarding if role mismatch
      if (onboardingRole && onboardingRole !== role) {
        return NextResponse.redirect(new URL(`/onboarding/${role}`, req.url));
      }

      // Always allow access to onboarding - no completion checks
      return NextResponse.next();
    }

    // Role-based access control for protected routes
    // These are the ONLY routes that should be blocked by role

    // Protect Tenant Routes - only tenants and admins can access
    if (isTenantRoute(req) && role !== "tenant" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Landlord Routes - only landlords and admins can access
    if (isLandlordRoute(req) && role !== "landlord" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Admin Routes - only admins can access
    if (isAdminRoute(req) && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // check admin routes for only added admins
    if (isAdminRoute(req)) {
      const userId = sessionClaims?.sub;

      const isAdmin = ADMIN_USER_IDS.includes(userId);

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  // Allow access to all other routes
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
