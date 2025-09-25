const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Database connection configuration
const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
});

async function updateUserRolesTable() {
  try {
    console.log("🔗 Connecting to database...");
    await client.connect();
    console.log("✅ Connected to database successfully");

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "update-user-roles-table.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    console.log("📄 Executing SQL script to update user_roles table...");

    // Execute the SQL script
    const result = await client.query(sqlContent);

    console.log("✅ User roles table updated successfully!");
    console.log("📊 Result:", result);

    // Verify the updated table structure
    console.log("\n🔍 Verifying updated table structure...");
    const verifyResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'user_roles' 
      ORDER BY ordinal_position
    `);

    console.log("📋 Updated user_roles table structure:");
    console.table(verifyResult.rows);

    // Check if there are any existing records
    const countResult = await client.query(
      "SELECT COUNT(*) as count FROM user_roles"
    );
    console.log(
      `\n📊 Total records in user_roles table: ${countResult.rows[0].count}`
    );

    console.log("\n✅ Successfully updated user_roles table structure");
  } catch (error) {
    console.error("❌ Error updating user_roles table:", error);
    throw error;
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
if (require.main === module) {
  updateUserRolesTable()
    .then(() => {
      console.log("🎉 Script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Script failed:", error);
      process.exit(1);
    });
}

module.exports = { updateUserRolesTable };
