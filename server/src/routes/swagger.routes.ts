import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.js";

const router = express.Router();

// JSON specification endpoint (machine-readable)
router.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Interactive UI endpoint (human-readable)
router.use("/docs", swaggerUi.serve);
router.get(
  "/docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "UrbanKey API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "list",
      filter: true,
      tryItOutEnabled: true,
    },
  })
);

export default router;
