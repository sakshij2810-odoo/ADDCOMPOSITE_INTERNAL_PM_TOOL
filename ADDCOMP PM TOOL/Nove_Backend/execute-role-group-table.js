const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Database connection configuration
const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
});

async function createRoleGroupTable() {
  try {
    console.log("🔗 Connecting to database...");
    await client.connect();
    console.log("✅ Connected to database successfully");

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "create-role-group-table.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    console.log("📄 Executing SQL script...");

    // Execute the SQL script
    const result = await client.query(sqlContent);

    console.log("✅ Role group table created and data inserted successfully!");
    console.log("📊 Result:", result);

    // Verify the data
    console.log("\n🔍 Verifying inserted data...");
    const verifyResult = await client.query(`
            SELECT 
                role_group_id,
                role_group_unique_id,
                role_group_uuid,
                role_group,
                status,
                created_by_uuid,
                create_ts,
                insert_ts
            FROM latest_role_group
            ORDER BY role_group_unique_id
        `);

    console.log("📋 Role Groups:");
    console.table(verifyResult.rows);

    console.log(
      `\n✅ Successfully created latest_role_group table with ${verifyResult.rows.length} records`
    );
  } catch (error) {
    console.error("❌ Error creating role group table:", error);
    throw error;
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
if (require.main === module) {
  createRoleGroupTable()
    .then(() => {
      console.log("🎉 Script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Script failed:", error);
      process.exit(1);
    });
}

module.exports = { createRoleGroupTable };
