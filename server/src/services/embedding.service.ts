import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../config/database.js";

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

    // Set search path
    await prisma.$executeRaw`SET search_path TO urbankey, public`;

    // Simple insert with ON CONFLICT
    await prisma.$executeRaw`
        INSERT INTO property_embeddings (property_id, content, embedding, updated_at)
        VALUES (${propertyId}, ${text}, ${JSON.stringify(
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

export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    await prisma.$executeRaw`SET search_path TO urbankey, public`;

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
          (SELECT json_agg(json_build_object('imageUrl', pi.image_url, 'isPrimary', pi.is_primary))
           FROM property_images pi 
           WHERE pi.property_id = p.id) as images,
          1 - (pe.embedding <=> ${JSON.stringify(
            queryEmbedding
          )}::vector) as similarity
        FROM properties p
        JOIN property_embeddings pe ON p.id = pe.property_id
        WHERE p.is_active = true
        ORDER BY pe.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT ${limit}
      `;

    return results as any[];
  } catch (error) {
    console.error("Error performing semantic search:", error);
    throw new Error("Failed to perform semantic search");
  }
}
