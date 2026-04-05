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
  "/disclaimer",
  "/cookies",
  "/terms",
  "/privacy",
  "/blog",
  "/sitemap",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/api/webhook(.*)", // Webhooks for Clerk/Stripe/etc.

  "/auth/login(.*)",
  "/auth/register/tenant(.*)",
  "/auth/register/landlord(.*)", // Add this!
  "/api/clerk/metadata(.*)", // Ensure your webhooks/api can be hit
  "/site.webmanifest", // Allow the manifest to load without logging in!
  "/(.*)\\.png$", // Allow images
  "/(.*)\\.ico$", // Allow favicons
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

    // FIX 1: Do NOT default to "tenant" immediately. Leave it undefined if it doesn't exist yet.
    const actualRole = (metadata.role as string)?.toLowerCase();

    // Handle onboarding routes
    if (isOnboardingRoute(req)) {
      const onboardingRole = req.nextUrl.pathname.split("/")[2];

      // FIX 2: Only redirect IF they already have a defined role, AND it mismatches.
      // If actualRole is undefined (new user), we let them through to the onboarding page they want!
      if (actualRole && onboardingRole && onboardingRole !== actualRole) {
        return NextResponse.redirect(
          new URL(`/onboarding/${actualRole}`, req.url)
        );
      }

      // Always allow access to onboarding - no completion checks
      return NextResponse.next();
    }

    // FIX 3: For all other protected routes, NOW we can safely assume "tenant" as a fallback
    const effectiveRole = actualRole || "tenant";

    // Protect Tenant Routes - only tenants and admins can access
    if (
      isTenantRoute(req) &&
      effectiveRole !== "tenant" &&
      effectiveRole !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Landlord Routes - only landlords and admins can access
    if (
      isLandlordRoute(req) &&
      effectiveRole !== "landlord" &&
      effectiveRole !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Admin Routes - only admins can access
    if (isAdminRoute(req) && effectiveRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // check admin routes for only added admins
    if (isAdminRoute(req)) {
      const userId = sessionClaims?.sub;
      // Note: Assuming ADMIN_USER_IDS is defined at the top of your file
      const isAdmin = ADMIN_USER_IDS.includes(userId as string);

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
