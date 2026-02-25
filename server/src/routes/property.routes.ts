// # Property endpoints
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createProperty } from "../controllers/property.controller.js";

const router = Router();

router.post("/", requireAuth, createProperty);
// other CRUD routes

export default router;
