import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../config/database.js";
import crypto from "crypto";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const EMBEDDING_MODEL = "gemini-embedding-001";

// Generate embedding for property text
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);

    if (!result.embedding || !result.embedding.values) {
      throw new Error("No embedding values returned");
    }

    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

// Generate property text for embedding
export function generatePropertyText(property: any): string {
  const amenities = [];
  if (property.hasWater247) amenities.push("24/7 water supply");
  if (property.hasPowerBackup) amenities.push("power backup");
  if (property.hasIglPipeline) amenities.push("IGL gas pipeline");

  return `
    ${property.title}
    ${property.description || ""}
    ${property.bhk} apartment
    Rent: ₹${property.rent}
    Furnishing: ${property.furnishing}
    Tenant type: ${property.tenantType}
    Location: ${property.addressLine1}, ${property.city}
    ${
      property.nearestMetroStation
        ? `Near ${property.nearestMetroStation} metro (${property.distanceToMetroKm}km)`
        : ""
    }
    Amenities: ${amenities.join(", ")}
  `
    .trim()
    .replace(/\s+/g, " ");
}

// Create or update property embedding
export async function upsertPropertyEmbedding(
  propertyId: string
): Promise<void> {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      console.error(`Property ${propertyId} not found`);
      return;
    }

    const text = generatePropertyText(property);
    console.log(`Generating embedding for property ${propertyId}...`);

    const embedding = await generateEmbedding(text);
    console.log(`Embedding generated with ${embedding.length} dimensions`);

    // Generate a unique ID since raw queries bypass Prisma's cuid() generator
    const newId = crypto.randomUUID();

    // Set search path
    await prisma.$executeRaw`SET search_path TO urbankey, public`;

    // Simple insert with ON CONFLICT and explicitly provided ID
    await prisma.$executeRaw`
      INSERT INTO property_embeddings (id, property_id, content, embedding, updated_at)
      VALUES (${newId}, ${propertyId}, ${text}, ${JSON.stringify(
      embedding
    )}::vector, NOW())
      ON CONFLICT (property_id) 
      DO UPDATE SET 
        content = ${text},
        embedding = ${JSON.stringify(embedding)}::vector,
        updated_at = NOW()
    `;

    console.log(`✅ Embedding created/updated for property ${propertyId}`);
  } catch (error) {
    console.error("Error upserting embedding:", error);
  }
}

// Search properties by semantic similarity
export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    const embeddingCount: any = await prisma.$queryRaw`
      SELECT COUNT(*) FROM "urbankey"."property_embeddings" WHERE embedding IS NOT NULL
    `;

    const count = Number(Object.values(embeddingCount[0])[0]);
    if (count === 0) {
      console.log("No embeddings found, falling back to regular search");
      return fallbackSearch(query, limit);
    }

    // FIX: Using OPERATOR(urbankey.<=>) tells Postgres exactly where to find the vector comparison math!
    const results: any = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.rent,
        p.bhk,
        p.furnishing,
        p.city,
        p.has_water_247,
        p.has_power_backup,
        p.has_igl_pipeline,
        p.nearest_metro_station,
        p.distance_to_metro_km,
        p.is_broker,
        p.brokerage_fee,
        p.address_line1,
        p.is_active,
        (SELECT json_agg(json_build_object('imageUrl', pi.image_url, 'isPrimary', pi.is_primary))
         FROM "urbankey"."property_images" pi 
         WHERE pi.property_id = p.id) as images,
        1 - (pe.embedding OPERATOR(urbankey.<=>) ${JSON.stringify(
          queryEmbedding
        )}::"urbankey"."vector") as similarity
      FROM "urbankey"."properties" p
      JOIN "urbankey"."property_embeddings" pe ON p.id = pe.property_id
      WHERE p.is_active = true
        AND pe.embedding IS NOT NULL
      ORDER BY pe.embedding OPERATOR(urbankey.<=>) ${JSON.stringify(
        queryEmbedding
      )}::"urbankey"."vector"
      LIMIT ${limit}
    `;

    console.log(`Found ${results.length} results via semantic search`);
    return results as any[];
  } catch (error) {
    console.error("Error performing semantic search:", error);
    return fallbackSearch(query, limit);
  }
}

// Fallback search when embedding fails
async function fallbackSearch(query: string, limit: number): Promise<any[]> {
  try {
    const results = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.rent,
        p.bhk,
        p.furnishing,
        p.city,
        p.has_water_247,
        p.has_power_backup,
        p.has_igl_pipeline,
        p.nearest_metro_station,
        p.distance_to_metro_km,
        p.is_broker,
        p.brokerage_fee,
        p.address_line1,
        p.is_active,
        (SELECT json_agg(json_build_object('imageUrl', pi.image_url, 'isPrimary', pi.is_primary))
         FROM "urbankey"."property_images" pi 
         WHERE pi.property_id = p.id) as images,
        ts_rank(to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', ${query})) as relevance
      FROM "urbankey"."properties" p
      WHERE p.is_active = true
        AND (p.title ILIKE ${`%${query}%`} OR p.description ILIKE ${`%${query}%`} OR p.city ILIKE ${`%${query}%`})
      ORDER BY relevance DESC
      LIMIT ${limit}
    `;
    return results as any[];
  } catch (err) {
    console.error("Fallback search failed:", err);
    return [];
  }
}
