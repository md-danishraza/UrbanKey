import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/faqs",
    "/terms",
    "/privacy",
    "/cookies",
    "/disclaimer",
    "/properties/search",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic property routes (you can fetch from API)
  // This would be better to fetch from your API
  const propertyRoutes: never[] = [];

  return [...staticRoutes, ...propertyRoutes];
}
