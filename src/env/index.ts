import { z } from "zod/v4";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  TARGET_WA_ID: z.string(),
  DB_URL: z.string().default("mongodb://localhost:27017"),
  DB: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  PORT: z.coerce.number().default(8080),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const message = "Invalid environment variables";
  console.error(message, _env.error.format());
  throw new Error(message);
}

export const env = _env.data;
