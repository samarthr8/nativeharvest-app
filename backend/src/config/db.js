const { Pool } = require("pg");

if (!process.env.DB_PASSWORD) {
  console.error("FATAL: DB_PASSWORD environment variable is required");
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  user: process.env.DB_USER || "nhuser",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "nativeharvest",
  port: process.env.DB_PORT || 5432
});

module.exports = pool;

