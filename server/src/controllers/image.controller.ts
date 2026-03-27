import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import {
  uploadPropertyImages,
  deletePropertyImage,
  deletePropertyImages, // Restored import for bulk deletion
} from "../services/storage.service.js";
import multer from "multer";
import path from "path";

// Configure multer for memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Upload images for a property
export const uploadPropertyImagesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // FIX: Safely parse propertyId
    const rawPropertyId = req.params.propertyId;
    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    if (!propertyId)
      return res.status(400).json({ error: "Property ID required" });

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Upload images
    const imageUrls = await uploadPropertyImages(
      files.map((f) => ({
        buffer: f.buffer,
        originalname: f.originalname,
        mimetype: f.mimetype,
      })),
      userId,
      propertyId
    );

    // FIX: Check the count BEFORE the loop to prevent race conditions!
    const existingImageCount = await prisma.propertyImage.count({
      where: { propertyId },
    });

    // Save image records to database
    const images = await Promise.all(
      imageUrls.map((url, index) =>
        prisma.propertyImage.create({
          data: {
            propertyId,
            imageUrl: url,
            isPrimary: existingImageCount === 0 && index === 0, // Only the first uploaded image becomes primary
            sortOrder: existingImageCount + index, // Add to the end of the existing list
          },
        })
      )
    );

    res.json({
      success: true,
      images,
      message: `${images.length} images uploaded successfully`,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Set primary image for a property
export const setPrimaryImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // FIX: Safely parse params
    const rawPropertyId = req.params.propertyId;
    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    const rawImageId = req.params.imageId;
    const imageId = Array.isArray(rawImageId) ? rawImageId[0] : rawImageId;

    if (!propertyId || !imageId)
      return res.status(400).json({ error: "Missing parameters" });

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Reset all images to non-primary
    await prisma.propertyImage.updateMany({
      where: { propertyId },
      data: { isPrimary: false },
    });

    // Set selected image as primary
    const image = await prisma.propertyImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    res.json({
      success: true,
      image,
      message: "Primary image updated",
    });
  } catch (error) {
    console.error("Error setting primary image:", error);
    res.status(500).json({ error: "Failed to set primary image" });
  }
};

// Delete an image
export const deletePropertyImageController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // FIX: Safely parse params
    const rawPropertyId = req.params.propertyId;
    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    const rawImageId = req.params.imageId;
    const imageId = Array.isArray(rawImageId) ? rawImageId[0] : rawImageId;

    if (!propertyId || !imageId)
      return res.status(400).json({ error: "Missing parameters" });

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Get image record
    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete from storage
    await deletePropertyImage(image.imageUrl);

    // Delete from database
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    // If deleted image was primary, set another image as primary
    if (image.isPrimary) {
      const remainingImage = await prisma.propertyImage.findFirst({
        where: { propertyId },
        orderBy: { sortOrder: "asc" }, // Grab the next first image
      });

      if (remainingImage) {
        await prisma.propertyImage.update({
          where: { id: remainingImage.id },
          data: { isPrimary: true },
        });
      }
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

// Delete all images for a property
export const deleteAllPropertyImagesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Safely parse propertyId
    const rawPropertyId = req.params.propertyId;
    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    if (!propertyId)
      return res.status(400).json({ error: "Property ID required" });

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Delete all images from Supabase storage
    await deletePropertyImages(propertyId, userId);

    // // Delete all image records from the database
    // await prisma.propertyImage.deleteMany({
    //   where: { propertyId },
    // });

    res.json({
      success: true,
      message: "All property images deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all property images:", error);
    res.status(500).json({ error: "Failed to delete all property images" });
  }
};

// Reorder images
export const reorderImages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // FIX: Safely parse params
    const rawPropertyId = req.params.propertyId;
    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    if (!propertyId)
      return res.status(400).json({ error: "Property ID required" });

    const { imageOrder } = req.body; // Array of image IDs in desired order

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.landlordId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Update sort order for each image
    await Promise.all(
      imageOrder.map((imgId: string, index: number) =>
        prisma.propertyImage.update({
          where: { id: imgId },
          data: { sortOrder: index },
        })
      )
    );

    res.json({
      success: true,
      message: "Images reordered successfully",
    });
  } catch (error) {
    console.error("Error reordering images:", error);
    res.status(500).json({ error: "Failed to reorder images" });
  }
};
