import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { configDotenv } from "dotenv";

// Load environment variables from .env file
configDotenv();

// pooled app perforamce
const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool, {
  schemas: ["urbankey"], // Explicitly pass schemas for multi-schema support
});

const prisma = new PrismaClient({ adapter });

export default prisma;
