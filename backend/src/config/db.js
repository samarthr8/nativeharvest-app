const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  user: process.env.DB_USER || "nhuser",
  password: process.env.DB_PASSWORD || "nhpassword",
  database: process.env.DB_NAME || "nativeharvest",
  port: 5432
});

module.exports = pool;

