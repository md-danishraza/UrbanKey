import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../config/database.js";

// Helper function to validate ID
const validateId = (id: string | string[] | undefined): string => {
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid ID format");
  }
  return id;
};

// Get all pending verifications
export const getPendingVerifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await prisma.userDocument.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all verifications (with filters)
export const getAllVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const [documents, total] = await Promise.all([
      prisma.userDocument.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          uploadedAt: "desc",
        },
        skip,
        take: Number(limit),
      }),
      prisma.userDocument.count({ where }),
    ]);

    res.json({
      success: true,
      documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get verification stats
export const getVerificationStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [pending, approved, rejected, total] = await Promise.all([
      prisma.userDocument.count({ where: { status: "PENDING" } }),
      prisma.userDocument.count({ where: { status: "APPROVED" } }),
      prisma.userDocument.count({ where: { status: "REJECTED" } }),
      prisma.userDocument.count(),
    ]);

    // Get daily stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await prisma.userDocument.groupBy({
      by: ["status"],
      where: {
        uploadedAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        status: true,
      },
    });

    res.json({
      success: true,
      stats: {
        pending,
        approved,
        rejected,
        total,
        daily: dailyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Approve document
export const approveDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let documentId: string;
    try {
      documentId = validateId(req.params.documentId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await prisma.userDocument.update({
      where: { id: documentId },
      data: {
        status: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: userId,
      },
      include: {
        user: true,
      },
    });

    // If user has all required documents approved, update user's verification status
    const allDocs = await prisma.userDocument.findMany({
      where: {
        userId: document.userId,
        status: "APPROVED",
      },
    });

    // Check if user has all required documents (Aadhar is mandatory)
    const hasAadhar = allDocs.some((doc) => doc.documentType === "aadhar");

    if (hasAadhar) {
      await prisma.user.update({
        where: { id: document.userId },
        data: {
          isVerified: true,
        },
      });
    }

    res.json({
      success: true,
      document,
      message: "Document approved successfully",
    });
  } catch (error) {
    console.error("Error approving document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject document
export const rejectDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let documentId: string;
    try {
      documentId = validateId(req.params.documentId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const { reason } = req.body;

    const document = await prisma.userDocument.update({
      where: { id: documentId },
      data: {
        status: "REJECTED",
        rejectionReason: reason || "No reason provided",
        verifiedAt: new Date(),
        verifiedBy: userId,
      },
    });

    res.json({
      success: true,
      document,
      message: "Document rejected",
    });
  } catch (error) {
    console.error("Error rejecting document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get document by ID
export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let documentId: string;
    try {
      documentId = validateId(req.params.documentId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid document ID" });
    }

    const document = await prisma.userDocument.findUnique({
      where: { id: documentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
