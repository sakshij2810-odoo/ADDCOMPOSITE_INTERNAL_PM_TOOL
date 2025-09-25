#!/usr/bin/env node

/**
 * Simple Database Viewer Script
 * This script helps you view your database tables and data without Prisma
 */

const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://postgres:password@localhost:5432/pm_platform",
});

async function viewDatabase() {
  try {
    console.log("🔍 Connecting to database...");

    // Test connection
    await client.connect();
    console.log("✅ Connected to database successfully!");

    // Get all tables
    console.log("\n📋 Available Tables:");
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    tablesResult.rows.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });

    // Get table counts
    console.log("\n📊 Table Row Counts:");
    for (const table of tablesResult.rows) {
      try {
        const countResult = await client.query(
          `SELECT COUNT(*) as count FROM ${table.table_name}`
        );
        console.log(`${table.table_name}: ${countResult.rows[0].count} rows`);
      } catch (error) {
        console.log(`${table.table_name}: Error getting count`);
      }
    }

    // Show sample data from users table
    console.log("\n👥 Sample Users:");
    try {
      const usersResult = await client.query(`
        SELECT user_uuid, email, full_name, role_value, status, create_ts
        FROM users 
        LIMIT 5
      `);

      if (usersResult.rows.length > 0) {
        console.table(usersResult.rows);
      } else {
        console.log(
          "No users found. Run the setup script to populate sample data."
        );
      }
    } catch (error) {
      console.log("Users table not found or error:", error.message);
    }

    // Show sample data from company_information table
    console.log("\n🏢 Company Information:");
    try {
      const companyResult = await client.query(`
        SELECT id, company_name, company_title, created_at
        FROM company_information 
        LIMIT 5
      `);

      if (companyResult.rows.length > 0) {
        console.table(companyResult.rows);
      } else {
        console.log("No company information found.");
      }
    } catch (error) {
      console.log(
        "Company information table not found or error:",
        error.message
      );
    }

    // Show sample data from analytics_data table
    console.log("\n📈 Analytics Data:");
    try {
      const analyticsResult = await client.query(`
        SELECT id, metric_name, metric_value, growth_percentage, date_from, date_to
        FROM analytics_data 
        LIMIT 5
      `);

      if (analyticsResult.rows.length > 0) {
        console.table(analyticsResult.rows);
      } else {
        console.log("No analytics data found.");
      }
    } catch (error) {
      console.log("Analytics data table not found or error:", error.message);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n💡 Make sure to:");
    console.log("1. PostgreSQL is running");
    console.log('2. Database "pm_platform" exists');
    console.log('3. User "postgres" has access');
  } finally {
    await client.end();
  }
}

// Run the viewer
viewDatabase();
