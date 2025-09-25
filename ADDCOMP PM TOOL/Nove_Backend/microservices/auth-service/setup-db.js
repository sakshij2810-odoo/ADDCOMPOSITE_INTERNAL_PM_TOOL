// Simple database setup script for development
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db", // Using SQLite for development
    },
  },
});

async function main() {
  console.log("🌱 Starting database setup...");

  try {
    for (const userData of users) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (!existingUser) {
          const user = await prisma.user.create({
            data: userData,
          });
          console.log(`✅ Created user: ${user.name} (${user.email})`);
        } else {
          console.log(`⚠️  User already exists: ${userData.email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }
  } catch (error) {
    console.error("❌ Setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
