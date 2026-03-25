import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  upload,
  uploadPropertyImagesController,
  setPrimaryImage,
  deletePropertyImageController,
  reorderImages,
  deleteAllPropertyImagesController,
} from "../controllers/image.controller.js";

const router = Router();

// All image routes require authentication
router.use(requireAuth);

// Upload multiple images for a property
router.post(
  "/properties/:propertyId/images",
  upload.array("images", 10), // Max 10 images
  uploadPropertyImagesController
);

// Set primary image
router.put("/properties/:propertyId/images/:imageId/primary", setPrimaryImage);

// Delete an image
router.delete(
  "/properties/:propertyId/images/:imageId",
  deletePropertyImageController
);

// Delete ALL images for a property
router.delete(
  "/properties/:propertyId/images",
  deleteAllPropertyImagesController
);

// Reorder images
router.put("/properties/:propertyId/images/reorder", reorderImages);

export default router;
