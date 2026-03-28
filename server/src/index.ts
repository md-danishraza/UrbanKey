import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import onBoardingRoutes from "./routes/onboarding.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import testRoutes from "./routes/test.routes.js";
import documentRoutes from "./routes/document.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import agreementRoutes from "./routes/agreement.routes.js";
import imageRoutes from "./routes/image.routes.js";
import landlordDashboardRoutes from "./routes/landlordDashboard.routes.js";
import leadRoutes from "./routes/leads.routes.js";
import visitRoutes from "./routes/visits.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev"));

// Special handling for webhook raw body
app.use("/api/auth/webhook", express.raw({ type: "application/json" }));

// Regular JSON parsing for other routes
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onBoardingRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);
// onboarding agreement
app.use("/api/agreement", agreementRoutes);
app.use("/api/images", imageRoutes);
// dashboards
app.use("/api/landlord/dashboard", landlordDashboardRoutes);
// implement later on
// app.use('/api/tenant/dashboard', landlordDashboardRoutes);

app.use("/api/leads", leadRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

if (process.env.NODE_ENV === "development") {
  app.use("/api/test", testRoutes);
  console.log("🧪 Test routes enabled for development");
}

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
