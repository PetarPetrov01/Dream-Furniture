require("dotenv").config();

// Required at boot. No fallback values: a missing secret should crash loudly,
// never silently sign tokens/cookies with a hardcoded default.
const REQUIRED = ["DATABASE_URL", "JWT_SECRET", "COOKIE_SECRET"];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[config] Missing required environment variable(s): ${missing.join(", ")}`
  );
  console.error(
    "Copy server/.env.example to server/.env and provide real values before starting."
  );
  process.exit(1);
}

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
};
