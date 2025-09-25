const { Pool } = require("pg");
require("dotenv").config();

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER || "sakshikalyanjadhav",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "pm_platform",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the connection
pool.on("connect", () => {
  console.log("🗄️ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(
      `📊 Query executed in ${duration}ms:`,
      text.substring(0, 50) + "..."
    );
    return res;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
};

// Helper function to get a client from the pool
const getClient = async () => {
  return await pool.connect();
};

// Helper function to execute a transaction
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
};
