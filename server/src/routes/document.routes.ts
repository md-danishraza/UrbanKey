import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  upload,
  uploadUserDocument,
  getUserDocuments,
  deleteUserDocument,
} from "../controllers/document.controller.js";

const router = Router();

// Adhar

// All document routes require authentication
router.use(requireAuth);

// Upload document (multipart/form-data)
router.post("/upload", upload.single("file"), uploadUserDocument);

// Get all user documents
router.get("/", getUserDocuments);

// Delete document
router.delete("/:documentId", deleteUserDocument);

export default router;
