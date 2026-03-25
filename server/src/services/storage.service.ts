import { createClient } from "@supabase/supabase-js";

// Ensure these exist in your .env file
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

// Initialize Supabase client with the Secret Key
export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
  },
});

// Different buckets for different purposes
export const DOCUMENTS_BUCKET =
  process.env.SUPABASE_DOCUMENTS_BUCKET || "urbankey-verification-docs";
export const PROPERTY_IMAGES_BUCKET =
  process.env.SUPABASE_PROPERTY_BUCKET || "urbankey-property-images";

/**
 * Upload a property image to Supabase Storage
 */
export async function uploadPropertyImage(
  file: Buffer,
  fileName: string,
  landlordId: string,
  propertyId: string,
  mimeType: string
): Promise<string> {
  try {
    // Create a unique file path: landlord_id/property_id/timestamp_filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${landlordId}/${propertyId}/${timestamp}_${sanitizedFileName}`;

    const { error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading property image:", error);
    throw new Error("Failed to upload property image");
  }
}

/**
 * Upload multiple property images
 */
export async function uploadPropertyImages(
  files: Array<{ buffer: Buffer; originalname: string; mimetype: string }>,
  landlordId: string,
  propertyId: string
): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadPropertyImage(
      file.buffer,
      file.originalname,
      landlordId,
      propertyId,
      file.mimetype
    )
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete a property image
 */
export async function deletePropertyImage(fileUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
    const urlParts = fileUrl.split("/");
    const bucketIndex = urlParts.indexOf(PROPERTY_IMAGES_BUCKET);

    if (bucketIndex === -1) {
      throw new Error("Invalid image URL");
    }

    const filePath = urlParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting property image:", error);
    throw new Error("Failed to delete property image");
  }
}

/**
 * Delete all images for a property
 */
export async function deletePropertyImages(
  propertyId: string,
  landlordId: string
): Promise<void> {
  try {
    const folderPath = `${landlordId}/${propertyId}/`;

    // List all files in the folder
    const { data: files, error: listError } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .list(folderPath);

    if (listError) throw listError;

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${folderPath}${file.name}`);

      const { error: deleteError } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.error("Error deleting property images:", error);
    throw new Error("Failed to delete property images");
  }
}

// Document upload functions (existing)
export async function uploadDocument(
  file: File | Buffer,
  fileName: string,
  userId: string,
  documentType: string,
  mimeType: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${userId}/${documentType}/${timestamp}_${sanitizedFileName}`;

    const { error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(DOCUMENTS_BUCKET)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw new Error("Failed to upload document");
  }
}

export async function deleteDocument(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
}
