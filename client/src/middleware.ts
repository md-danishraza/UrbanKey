import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

// 3. Define role-specific protected routes
const isTenantRoute = createRouteMatcher(["/tenant(.*)"]);

const isLandlordRoute = createRouteMatcher(["/landlord(.*)"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// 4. Onboarding routes (require auth but special handling)
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  console.log(sessionClaims?.publicMetadata);

  // Protect Onboarding Routes in Middleware
  if (userId) {
    const metadata =
      (sessionClaims?.publicMetadata as Record<string, any>) || {};
    const role = (metadata.role as string)?.toLowerCase() || "tenant";

    // Prevent tenant from accessing landlord onboarding and vice versa
    if (isOnboardingRoute(req)) {
      const onboardingRole = req.nextUrl.pathname.split("/")[2]; // /onboarding/tenant or /onboarding/landlord

      if (onboardingRole && onboardingRole !== role) {
        // Redirect to correct onboarding
        return NextResponse.redirect(new URL(`/onboarding/${role}`, req.url));
      }

      // If user already completed onboarding, redirect to dashboard
      if (metadata.onboardingCompleted) {
        const dashboardUrl =
          role === "tenant" ? "/properties/search" : "/landlord/dashboard";
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      return NextResponse.next();
    }
  }

  // 1. Redirect authenticated users away from auth pages
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Protect all non-public routes (Force sign-in)
  if (!userId && !isPublicRoute(req)) {
    // Clerk's built-in redirect handles the ?redirect_url automatically!
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 3. Role-based access control for authenticated users
  if (userId) {
    // Safely extract the role from the custom session claims we configured in the dashboard
    // We cast it to a generic object to avoid TypeScript complaining about custom claim types
    const metadata =
      (sessionClaims?.publicMetadata as Record<string, any>) || {};
    const role = (metadata.role as string)?.toLowerCase() || "tenant";
    const isVerified = metadata.isVerified === true;

    // Allow access to onboarding routes so the server can actually set their role!
    if (isOnboardingRoute(req)) {
      return NextResponse.next();
    }

    // Protect Tenant Routes
    if (isTenantRoute(req) && role !== "tenant" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Landlord Routes
    if (isLandlordRoute(req) && role !== "landlord" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Admin Routes
    if (isAdminRoute(req) && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Example Verification Check for Landlords listing new properties
    if (
      req.nextUrl.pathname.includes("/landlord/properties/new") &&
      role === "landlord" &&
      !isVerified
    ) {
      // Send them to a page explaining they need admin verification first
      return NextResponse.redirect(
        new URL("/landlord/verification-pending", req.url)
      );
    }
  }

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
