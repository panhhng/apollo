const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/apollo",
});

module.exports = { db };
