import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../config/database.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const EMBEDDING_MODEL = "gemini-embedding-001";
const CHAT_MODEL = "gemini-2.5-flash";

// // 1. Helper function to perform L2 Normalization
// function normalizeVector(vector: number[]): number[] {
//   // Calculate the magnitude (L2 norm)
//   const magnitude = Math.sqrt(
//     vector.reduce((sum, val) => sum + val * val, 0)
//   );

//   // Divide each value by the magnitude to scale the vector back to a length of 1
//   return vector.map((val) => val / magnitude);
// }

// Generate embedding for text
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);

    // // Get the original 3072D vector
    // let embedding = result.embedding.values;
    // // Truncate to 768 dimensions
    // embedding = embedding.slice(0, 768);
    // // Normalize the truncated vector so pgvector can process it accurately
    // embedding = normalizeVector(embedding);

    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

// Search similar properties using pgvector
async function searchSimilarProperties(
  queryEmbedding: number[],
  limit: number = 5
): Promise<any[]> {
  try {
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
        p.address_line1,
        p.has_water_247,
        p.has_power_backup,
        p.has_igl_pipeline,
        p.nearest_metro_station,
        p.distance_to_metro_km,
        p.is_broker,
        p.brokerage_fee,
        (SELECT json_agg(json_build_object('imageUrl', pi.image_url, 'isPrimary', pi.is_primary))
         FROM urbankey.property_images pi 
         WHERE pi.property_id = p.id) as images,
        1 - (pe.embedding <=> ${JSON.stringify(
          queryEmbedding
        )}::vector) as similarity
      FROM urbankey.properties p
      JOIN urbankey.property_embeddings pe ON p.id = pe.property_id
      WHERE p.is_active = true
      ORDER BY pe.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;

    return results as any[];
  } catch (error) {
    console.error("Error searching properties:", error);
    return [];
  }
}

// Build context from properties
function buildContext(properties: any[]): string {
  if (properties.length === 0) {
    return "No properties found in the database.";
  }

  let context = "Here are the available properties:\n\n";

  properties.forEach((p, index) => {
    const amenities = [];
    if (p.has_water_247) amenities.push("✓ 24/7 Water Supply");
    if (p.has_power_backup) amenities.push("✓ Power Backup");
    if (p.has_igl_pipeline) amenities.push("✓ IGL Gas Pipeline");

    context += `${index + 1}. **${p.title}**\n`;
    context += `   Location: ${p.address_line1}, ${p.city}\n`;
    context += `   Rent: ₹${p.rent.toLocaleString()}/month\n`;
    context += `   Type: ${p.bhk.replace("_", " ")} • ${p.furnishing.replace(
      "_",
      "-"
    )}\n`;
    if (p.nearest_metro_station) {
      context += `   Metro: ${p.distance_to_metro_km}km from ${p.nearest_metro_station}\n`;
    }
    if (amenities.length > 0) {
      context += `   Amenities: ${amenities.join(", ")}\n`;
    }
    context += `   Property ID: ${p.id}\n\n`;
  });

  return context;
}

// Get AI response using Gemini
async function getGeminiResponse(
  question: string,
  context: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: CHAT_MODEL });

    const prompt = `You are UrbanKey, a helpful rental assistant for properties in India. 
                    Answer questions based ONLY on the property data provided below. If the answer cannot be found in the context, 
                    politely say you don't have that information and suggest browsing the website.

                    CONTEXT:
                    ${context}

                    USER QUESTION: ${question}

                    RULES:
                    1. Only use information from the context above
                    2. Be conversational and helpful
                    3. Suggest viewing property details if interested
                    4. Keep responses concise but informative
                    5. Never invent properties or information

                    ANSWER:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    return "I'm having trouble connecting right now. Please try again later or browse our properties directly.";
  }
}

// Save chat history
async function saveChatHistory(
  userId: string,
  question: string,
  answer: string,
  relevantPropertyIds: string[]
): Promise<void> {
  try {
    await prisma.chatHistory.create({
      data: {
        userId,
        question,
        answer,
        relevantPropertyIds: relevantPropertyIds,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

// Get user chat history
export async function getUserChatHistory(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const history = await prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return history;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

// main RAG with urbankey context
export async function askQuestion(
  question: string,
  userId?: string
): Promise<{
  answer: string;
  properties: any[];
  suggestedQuestions?: string[];
}> {
  try {
    // Check if question is about UrbanKey platform
    const urbanKeyKeywords = [
      "urbankey",
      "platform",
      "how does",
      "what is",
      "features",
      "brokerage",
      "verification",
      "agreement",
      "payment",
    ];
    const isAboutPlatform = urbanKeyKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    // Generate embedding for property search (only if likely asking about properties)
    let similarProperties: any[] = [];
    if (!isAboutPlatform) {
      const queryEmbedding = await generateEmbedding(question);
      similarProperties = await searchSimilarProperties(queryEmbedding);
    }

    const context = buildContext(similarProperties);

    // Add UrbanKey platform context
    const urbanKeyContext = `
  URBANKEY PLATFORM INFO:
  - UrbanKey is a rental property platform connecting tenants with verified landlords in India
  - Zero brokerage model - direct owner listings only
  - Features: AI semantic search, Aadhar verification, digital rent agreements, WhatsApp chat, visit scheduling
  - Available cities: Bangalore, Delhi, Mumbai, Pune, Hyderabad, Chennai
  - Amenities filters: 24/7 water, power backup, IGL gas pipeline, parking, pet-friendly
  - Metro distance calculator for properties
  - Rent agreement generator with e-signatures
  - Payment tracking for monthly rent and security deposit
  `;

    const finalContext = isAboutPlatform
      ? urbanKeyContext
      : `${urbanKeyContext}\n\nPROPERTIES FOUND:\n${context}`;

    const answer = await getGeminiResponse(question, finalContext);

    // Save to history
    if (userId) {
      const propertyIds = similarProperties.map((p) => p.id);
      await saveChatHistory(userId, question, answer, propertyIds);
    }

    const suggestedQuestions = generateSuggestedQuestions(similarProperties);

    return { answer, properties: similarProperties, suggestedQuestions };
  } catch (error) {
    console.error("Error in RAG pipeline:", error);
    return {
      answer:
        "I'm having trouble processing your request. Please try again later.",
      properties: [],
      suggestedQuestions: [],
    };
  }
}

// Generate suggested follow-up questions
function generateSuggestedQuestions(properties: any[]): string[] {
  if (properties.length === 0) {
    return [
      "Show me properties under ₹30,000",
      "What properties have 24/7 water supply?",
      "Find me a 2BHK apartment",
      "Properties near metro station",
    ];
  }

  const suggestions = [];
  const firstProp = properties[0];

  if (firstProp) {
    suggestions.push(`Tell me more about ${firstProp.title}`);
  }
  suggestions.push(`Show properties under ₹${firstProp?.rent + 5000 || 30000}`);
  suggestions.push(`What amenities are available?`);
  suggestions.push(
    `Find similar properties in ${firstProp?.city || "Bangalore"}`
  );

  return suggestions.slice(0, 4);
}
