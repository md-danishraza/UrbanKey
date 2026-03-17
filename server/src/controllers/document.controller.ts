import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";
import { deleteDocument, uploadDocument } from "../services/storage.service.js";
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
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed"));
    }
  },
});

// Upload document
export const uploadUserDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!documentType) {
      return res.status(400).json({ error: "Document type is required" });
    }

    // Upload to Supabase
    const publicUrl = await uploadDocument(
      file.buffer,
      file.originalname,
      userId,
      documentType,
      file.mimetype // <-- ADDED: Passing the MIME type from Multer
    );

    // Save document reference in database
    const document = await prisma.userDocument.upsert({
      where: {
        userId_documentType: {
          userId,
          documentType,
        },
      },
      update: {
        fileUrl: publicUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: "PENDING",
        uploadedAt: new Date(),
      },
      create: {
        userId,
        documentType,
        fileUrl: publicUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: "PENDING",
      },
    });

    res.json({
      success: true,
      document: {
        id: document.id,
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        status: document.status,
      },
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
};

// Get user documents
export const getUserDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await prisma.userDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });

    res.json({ success: true, documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete document
export const deleteUserDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rawDocumentId = req.params.documentId;
    const documentId = Array.isArray(rawDocumentId)
      ? rawDocumentId[0]
      : rawDocumentId;

    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const document = await prisma.userDocument.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Extract file path from URL safely
    const filePath = document.fileUrl.split("/").slice(-3).join("/");

    // Delete from Supabase
    await deleteDocument(filePath);

    // Delete from database
    await prisma.userDocument.delete({
      where: { id: documentId },
    });

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
};
