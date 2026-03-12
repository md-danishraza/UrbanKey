import { Router } from "express";
import { getTestToken, seedTestUsers } from "../controllers/test.controller.js";

const router = Router();

// Development only routes
router.get("/token", getTestToken);
router.post("/seed-users", seedTestUsers);

export default router;
