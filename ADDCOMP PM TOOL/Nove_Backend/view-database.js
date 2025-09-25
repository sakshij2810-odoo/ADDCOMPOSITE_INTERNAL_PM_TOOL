#!/usr/bin/env node

/**
 * Database Viewer Script
 * This script helps you view your database tables and data in Cursor
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://postgres:password@localhost:5432/pm_platform",
    },
  },
});

async function viewDatabase() {
  try {
    console.log("🔍 Connecting to database...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Connected to database successfully!");

    // Get all tables
    console.log("\n📋 Available Tables:");
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });

    // Get table counts
    console.log("\n📊 Table Row Counts:");
    for (const table of tables) {
      try {
        const count =
          await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${table.table_name}`;
        console.log(`${table.table_name}: ${count[0].count} rows`);
      } catch (error) {
        console.log(`${table.table_name}: Error getting count`);
      }
    }

    // Show sample data from users table
    console.log("\n👥 Sample Users:");
    try {
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (users.length > 0) {
        console.table(users);
      } else {
        console.log(
          "No users found. Run the setup script to populate sample data."
        );
      }
    } catch (error) {
      console.log("Users table not found or error:", error.message);
    }

    // Show sample data from projects table
    console.log("\n📁 Sample Projects:");
    try {
      const projects = await prisma.project.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      });

      if (projects.length > 0) {
        console.table(projects);
      } else {
        console.log("No projects found.");
      }
    } catch (error) {
      console.log("Projects table not found or error:", error.message);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n💡 Make sure to:");
    console.log("1. Install PostgreSQL");
    console.log("2. Run the setup-database.sh script");
    console.log("3. Set DATABASE_URL environment variable");
  } finally {
    await prisma.$disconnect();
  }
}

// Run the viewer
viewDatabase();
