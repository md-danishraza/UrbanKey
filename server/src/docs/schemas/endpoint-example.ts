/**
 * Endpoint-specific response examples
 */

// ==================== AUTH EXAMPLES ====================

export const AuthWebhookExamples = {
  success: {
    summary: "Webhook processed successfully",
    value: {
      success: true,
      message: "Webhook processed successfully",
    },
  },
  invalidSignature: {
    summary: "Invalid webhook signature",
    value: {
      success: false,
      error: "Invalid signature",
      message: "Webhook signature verification failed",
    },
  },
};

// ==================== USER EXAMPLES ====================

export const UserExamples = {
  getUserSuccess: {
    summary: "User retrieved successfully",
    value: {
      success: true,
      data: {
        id: "user_2abc123def456",
        email: "john@example.com",
        fullName: "John Doe",
        phone: "+919876543210",
        role: "TENANT",
        isVerified: true,
        avatarUrl: "https://img.clerk.com/xxx",
        createdAt: "2024-01-15T10:30:00.000Z",
      },
    },
  },
  updateUserSuccess: {
    summary: "Profile updated successfully",
    value: {
      success: true,
      message: "Profile updated successfully",
      data: {
        id: "user_2abc123def456",
        fullName: "John Updated Doe",
        phone: "+919876543211",
      },
    },
  },
  deleteUserSuccess: {
    summary: "Account deleted successfully",
    value: {
      success: true,
      message: "User account deleted successfully",
    },
  },
};

// ==================== PROPERTY EXAMPLES ====================

export const PropertyExamples = {
  getPropertiesSuccess: {
    summary: "Properties retrieved successfully",
    value: {
      data: [
        {
          id: "prop_123",
          title: "Modern 2BHK in Whitefield",
          rent: 25000,
          bhk: "TWO_BHK",
          city: "Bangalore",
          images: [{ imageUrl: "https://...", isPrimary: true }],
          landlord: {
            id: "user_456",
            fullName: "Rajesh Kumar",
            isVerified: true,
          },
        },
      ],
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  },
  getPropertySuccess: {
    summary: "Property retrieved successfully",
    value: {
      id: "prop_123",
      title: "Modern 2BHK in Whitefield",
      description: "Spacious apartment with modern amenities",
      rent: 25000,
      bhk: "TWO_BHK",
      furnishing: "SEMI_FURNISHED",
      tenantType: "FAMILY",
      addressLine1: "123, Oakwood Residency",
      city: "Bangalore",
      hasWater247: true,
      hasPowerBackup: true,
      nearestMetroStation: "Baiyappanahalli",
      distanceToMetroKm: 1.2,
      images: [{ imageUrl: "https://...", isPrimary: true }],
      landlord: {
        id: "user_456",
        fullName: "Rajesh Kumar",
        phone: "+919876543210",
        email: "rajesh@example.com",
      },
      createdAt: "2024-01-15T10:30:00.000Z",
    },
  },
  createPropertySuccess: {
    summary: "Property created successfully",
    value: {
      success: true,
      message: "Property created successfully",
      data: {
        id: "prop_123",
        title: "Modern 2BHK in Whitefield",
        rent: 25000,
      },
    },
  },
  updatePropertySuccess: {
    summary: "Property updated successfully",
    value: {
      success: true,
      message: "Property updated successfully",
      data: {
        id: "prop_123",
        title: "Updated Title",
        rent: 27000,
      },
    },
  },
  togglePropertySuccess: {
    summary: "Property status toggled",
    value: {
      success: true,
      message: "Property activated successfully",
      isActive: true,
    },
  },
  deletePropertySuccess: {
    summary: "Property deleted successfully",
    value: {
      success: true,
      message: "Property deleted successfully",
    },
  },
  propertyNotFound: {
    summary: "Property not found",
    value: {
      error: "Property not found",
      message: "Property with ID prop_123 does not exist",
    },
  },
};

// ==================== LEAD EXAMPLES ====================

export const LeadExamples = {
  createLeadSuccess: {
    summary: "Lead created successfully",
    value: {
      success: true,
      lead: {
        id: "lead_123",
        propertyId: "prop_123",
        message: "Is this property still available?",
        contactMethod: "WHATSAPP",
        status: "NEW",
        createdAt: "2024-01-15T10:30:00.000Z",
      },
    },
  },
  updateLeadStatusSuccess: {
    summary: "Lead status updated",
    value: {
      success: true,
      lead: {
        id: "lead_123",
        status: "CONTACTED",
      },
    },
  },
};

// ==================== VISIT EXAMPLES ====================

export const VisitExamples = {
  createVisitSuccess: {
    summary: "Visit scheduled successfully",
    value: {
      success: true,
      visit: {
        id: "visit_123",
        propertyId: "prop_123",
        scheduledDate: "2024-01-20",
        scheduledTime: "10:30",
        status: "PENDING",
        notes: "I would like to see the master bedroom",
        createdAt: "2024-01-15T10:30:00.000Z",
      },
    },
  },
  updateVisitStatusSuccess: {
    summary: "Visit status updated",
    value: {
      success: true,
      visit: {
        id: "visit_123",
        status: "CONFIRMED",
      },
    },
  },
};

// ==================== WISHLIST EXAMPLES ====================

export const WishlistExamples = {
  addToWishlistSuccess: {
    summary: "Added to wishlist",
    value: {
      success: true,
      message: "Added to wishlist",
      wishlist: {
        id: "wish_123",
        propertyId: "prop_123",
        createdAt: "2024-01-15T10:30:00.000Z",
      },
    },
  },
  removeFromWishlistSuccess: {
    summary: "Removed from wishlist",
    value: {
      success: true,
      message: "Removed from wishlist",
    },
  },
  getWishlistSuccess: {
    summary: "Wishlist retrieved",
    value: {
      success: true,
      wishlist: [
        {
          id: "wish_123",
          propertyId: "prop_123",
          property: {
            id: "prop_123",
            title: "Modern 2BHK in Whitefield",
            rent: 25000,
          },
          createdAt: "2024-01-15T10:30:00.000Z",
        },
      ],
    },
  },
  checkWishlistStatus: {
    summary: "Wishlist status checked",
    value: {
      success: true,
      isInWishlist: true,
      wishlistId: "wish_123",
    },
  },
};

// ==================== AGREEMENT EXAMPLES ====================

export const AgreementExamples = {
  createAgreementSuccess: {
    summary: "Agreement created successfully",
    value: {
      success: true,
      agreement: {
        id: "agree_123",
        agreementNumber: "AGR/2024/0001",
        propertyId: "prop_123",
        tenantId: "user_456",
        startDate: "2024-02-01",
        endDate: "2025-01-31",
        monthlyRent: 25000,
        securityDeposit: 50000,
        status: "PENDING_SIGNATURE",
        signedByLandlord: true,
        signedByTenant: false,
      },
    },
  },
  signAgreementSuccess: {
    summary: "Agreement signed successfully",
    value: {
      success: true,
      agreement: {
        id: "agree_123",
        status: "ACTIVE",
        signedByTenant: true,
        signedAt: "2024-01-15T10:30:00.000Z",
      },
    },
  },
};

// ==================== PAYMENT EXAMPLES ====================

export const PaymentExamples = {
  recordPaymentSuccess: {
    summary: "Payment recorded successfully",
    value: {
      success: true,
      payment: {
        id: "pay_123",
        agreementId: "agree_123",
        amount: 25000,
        month: 1,
        year: 2024,
        paymentDate: "2024-02-05",
        type: "RENT",
        status: "PAID",
        paymentMethod: "UPI",
        transactionId: "TX123456",
      },
    },
  },
  getPaymentSummarySuccess: {
    summary: "Payment summary retrieved",
    value: {
      success: true,
      summary: {
        totalMonthlyCollection: 50000,
        totalPending: 25000,
        totalPaid: 25000,
        agreements: [
          {
            propertyTitle: "Modern 2BHK in Whitefield",
            tenantName: "John Doe",
            monthlyRent: 25000,
            pendingAmount: 0,
            paidAmount: 25000,
          },
        ],
      },
    },
  },
};

// ==================== CHAT EXAMPLES ====================

export const ChatExamples = {
  askQuestionSuccess: {
    summary: "AI response generated",
    value: {
      success: true,
      answer:
        "I found a Modern 2BHK in Whitefield at ₹25,000/month. It is 1.2km from Baiyappanahalli metro station and has 24/7 water supply and power backup. Would you like more details?",
      properties: [
        {
          id: "prop_123",
          title: "Modern 2BHK in Whitefield",
          rent: 25000,
        },
      ],
      suggestedQuestions: [
        "Tell me more about Modern 2BHK in Whitefield",
        "Show properties under ₹30,000",
      ],
    },
  },
  getChatHistorySuccess: {
    summary: "Chat history retrieved",
    value: {
      success: true,
      history: [
        {
          id: "chat_123",
          question: "Show me 2BHK apartments",
          answer: "I found 3 properties...",
          createdAt: "2024-01-15T10:30:00.000Z",
        },
      ],
    },
  },
  clearChatHistorySuccess: {
    summary: "Chat history cleared",
    value: {
      success: true,
      message: "Chat history cleared",
    },
  },
};

// ==================== CONTACT EXAMPLES ====================

export const ContactExamples = {
  submitContactSuccess: {
    summary: "Contact form submitted successfully",
    value: {
      success: true,
      message: "Email sent successfully! We'll get back to you soon.",
    },
  },
  validationError: {
    summary: "Validation error",
    value: {
      success: false,
      errors: [
        {
          msg: "Valid email address is required",
          param: "email",
          location: "body",
        },
        {
          msg: "Message must be at least 10 characters long",
          param: "message",
          location: "body",
        },
      ],
    },
  },
};

// ==================== ADMIN EXAMPLES ====================

export const AdminExamples = {
  approveDocumentSuccess: {
    summary: "Document approved",
    value: {
      success: true,
      message: "Document approved successfully",
      document: {
        id: "doc_123",
        status: "APPROVED",
        verifiedAt: "2024-01-15T10:30:00.000Z",
      },
    },
  },
  rejectDocumentSuccess: {
    summary: "Document rejected",
    value: {
      success: true,
      message: "Document rejected",
      document: {
        id: "doc_123",
        status: "REJECTED",
        rejectionReason: "Image is blurry, please upload a clear image",
      },
    },
  },
  updateUserRoleSuccess: {
    summary: "User role updated",
    value: {
      success: true,
      message: "User role updated to LANDLORD",
      user: {
        id: "user_123",
        role: "LANDLORD",
      },
    },
  },
  verifyUserSuccess: {
    summary: "User verified",
    value: {
      success: true,
      message: "User verified successfully",
      user: {
        id: "user_123",
        isVerified: true,
      },
    },
  },
  getVerificationStatsSuccess: {
    summary: "Verification statistics",
    value: {
      success: true,
      stats: {
        pending: 5,
        approved: 20,
        rejected: 3,
        total: 28,
        daily: [{ status: "PENDING", _count: { status: 2 } }],
      },
    },
  },
  getAdminPropertiesSuccess: {
    summary: "Admin properties retrieved",
    value: {
      success: true,
      data: [
        {
          id: "prop_123",
          title: "Modern 2BHK in Whitefield",
          landlord: { fullName: "Rajesh Kumar", email: "rajesh@example.com" },
          views: 156,
          leads: 12,
          status: "ACTIVE",
        },
      ],
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  },
};
