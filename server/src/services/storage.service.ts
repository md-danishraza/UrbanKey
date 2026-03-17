import { createClient } from "@supabase/supabase-js";

// Ensure these exist in your .env.local file
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

// Initialize Supabase client with the Secret Key
export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    // We disable session persistence because this is running on the server
    persistSession: false,
  },
});

export const BUCKET_NAME =
  process.env.SUPABASE_BUCKET || "urbankey-verification-docs";

/**
 * Uploads a document to Supabase Storage
 */
export async function uploadDocument(
  file: File | Buffer,
  fileName: string,
  userId: string,
  documentType: string,
  mimeType: string // <-- ADDED: Explicitly require the MIME type
): Promise<string> {
  try {
    // Create a unique file path: user_id/document_type/timestamp_filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${userId}/${documentType}/${timestamp}_${sanitizedFileName}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType, // <-- ADDED: Tell Supabase exactly what file type this is
      });

    if (error) throw error;

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw new Error("Failed to upload document");
  }
}

/**
 * Deletes a document from Supabase Storage using its file path
 */
export async function deleteDocument(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
}
