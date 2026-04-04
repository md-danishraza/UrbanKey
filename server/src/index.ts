import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/auth.routes.js";
import onBoardingRoutes from "./routes/onboarding.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import documentRoutes from "./routes/document.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import onBoardingAgreementRoutes from "./routes/onBoardingAgreement.routes.js";
import imageRoutes from "./routes/image.routes.js";
import landlordDashboardRoutes from "./routes/landlordDashboard.routes.js";
import leadRoutes from "./routes/leads.routes.js";
import visitRoutes from "./routes/visits.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import agreementRoutes from "./routes/agreement.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { securityHeaders } from "./middleware/securityHeaders.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ==================== SECURITY MIDDLEWARE ====================

// 1. Helmet - Sets various HTTP headers for security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com", "api.fontshare.com"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          process.env.SUPABASE_URL!,
          "images.unsplash.com",
        ],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          process.env.SUPABASE_URL!,
          "https://api.mapbox.com",
          "https://generativelanguage.googleapis.com",
        ].filter(Boolean),
      },
    },
  })
);
// header
// Additional XSS, clickjacking protection
app.use(securityHeaders);

// 2. CORS - Configured for production
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [FRONTEND_URL, "http://localhost:3000"];

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 3. Rate Limiting - Prevents DDoS and brute force attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development", // Skip in development
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development",
});

// 4. Compression - Compress responses
app.use(compression());

// 5. HPP - Prevent HTTP Parameter Pollution
app.use(hpp());

// 6. Data Sanitization - Prevent NoSQL injection and XSS
app.use(mongoSanitize());

// 7. Morgan logging with different formats for production/development
if (isProduction) {
  app.use(morgan("combined")); // Apache combined format for production
} else {
  app.use(morgan("dev")); // Color-coded dev format
}

// 8. Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 9. Special handling for webhook raw body (no parsing)
app.use("/api/auth/webhook", express.raw({ type: "application/json" }));

// 10. Apply rate limiting to specific route groups
app.use("/api/auth", authLimiter);
app.use("/api/contact", authLimiter);
app.use("/api/chat", globalLimiter);
app.use("/api/properties", globalLimiter);

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onBoardingRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/onboarding/agreement", onBoardingAgreementRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/landlord/dashboard", landlordDashboardRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/rent/agreements", agreementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// ==================== ERROR HANDLERS ====================
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ==================== START SERVER ====================
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔒 Security: ${isProduction ? "Production mode" : "Development mode"}`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

export default app;
