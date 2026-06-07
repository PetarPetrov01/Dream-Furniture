import "dotenv/config";

const REQUIRED = ["DATABASE_URL", "JWT_SECRET", "COOKIE_SECRET"] as const;

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[config] Missing required environment variable(s): ${missing.join(", ")}`);
  console.error("Copy server/.env.example to server/.env and provide real values before starting.");
  process.exit(1);
}

export const databaseUrl = process.env.DATABASE_URL as string;
export const jwtSecret = process.env.JWT_SECRET as string;
export const cookieSecret = process.env.COOKIE_SECRET as string;
