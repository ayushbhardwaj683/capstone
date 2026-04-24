import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "..", ".env.local"),
  path.resolve(process.cwd(), ".env.example"),
  path.resolve(process.cwd(), "..", ".env.example")
];

for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate, override: false });
  }
}

function getEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  clientUrl: getEnv("CLIENT_URL", "http://localhost:3000"),
  mongoUri: getEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/form-builder-saas"),
  jwtSecret: getEnv("JWT_SECRET", "change-me"),
  jwtExpiresIn: getEnv("JWT_EXPIRES_IN", "7d"),
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite"
};
