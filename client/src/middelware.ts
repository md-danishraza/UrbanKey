import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/properties(.*)",
  "/about",
  "/contact",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/api/webhook(.*)", // Add webhooks here so Stripe/Clerk can reach them without logging in
]);

// 2. Define routes specifically for authentication (Login/Register)
const isAuthRoute = createRouteMatcher([
  "/auth/login(.*)",
  "/auth/register(.*)",
]);

// 3. The Middleware Logic
export default clerkMiddleware(async (auth, req) => {
  // auth() is asynchronous in newer Clerk versions
  const { userId } = await auth();

  // Redirect authenticated users away from auth pages (e.g., if they go to /auth/login while logged in)
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect all non-public routes. If user is NOT logged in and route is NOT public -> redirect to login
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));

    // Alternatively, you can just use Clerk's built-in protect():
    // await auth.protect();
  }

  return NextResponse.next();
});

// 4. Matcher configuration (tells Next.js which files to run this middleware on)
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
