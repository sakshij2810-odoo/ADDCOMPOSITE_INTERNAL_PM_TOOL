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
    // Create dummy users
    const users = [
      {
        googleId: "google_123456789",
        email: "sakshi.jadhav@addcomposites.com",
        name: "Sakshi Jadhav",
        firstName: "Sakshi",
        lastName: "Jadhav",
        role: "ADMIN",
        department: "Engineering",
        position: "Lead Developer",
        phone: "+1-555-0101",
        isActive: true,
      },
      {
        googleId: "google_987654321",
        email: "john.doe@addcomposites.com",
        name: "John Doe",
        firstName: "John",
        lastName: "Doe",
        role: "PROJECT_MANAGER",
        department: "Project Management",
        position: "Senior Project Manager",
        phone: "+1-555-0102",
        isActive: true,
      },
      {
        googleId: "google_456789123",
        email: "jane.smith@addcomposites.com",
        name: "Jane Smith",
        firstName: "Jane",
        lastName: "Smith",
        role: "EMPLOYEE",
        department: "Engineering",
        position: "Software Developer",
        phone: "+1-555-0103",
        isActive: true,
      },
      {
        googleId: "google_789123456",
        email: "mike.wilson@addcomposites.com",
        name: "Mike Wilson",
        firstName: "Mike",
        lastName: "Wilson",
        role: "EMPLOYEE",
        department: "Design",
        position: "UI/UX Designer",
        phone: "+1-555-0104",
        isActive: true,
      },
      {
        googleId: "google_321654987",
        email: "sarah.johnson@addcomposites.com",
        name: "Sarah Johnson",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "EMPLOYEE",
        department: "Quality Assurance",
        position: "QA Engineer",
        phone: "+1-555-0105",
        isActive: true,
      },
    ];

    console.log("👥 Creating users...");

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

    console.log("🎉 Database setup completed!");
    console.log("\n📋 Created Users:");
    console.log("1. Sakshi Jadhav (Admin) - sakshi.jadhav@addcomposites.com");
    console.log("2. John Doe (Project Manager) - john.doe@addcomposites.com");
    console.log("3. Jane Smith (Employee) - jane.smith@addcomposites.com");
    console.log("4. Mike Wilson (Employee) - mike.wilson@addcomposites.com");
    console.log(
      "5. Sarah Johnson (Employee) - sarah.johnson@addcomposites.com"
    );
    console.log("\n🔑 Login Credentials:");
    console.log(
      "For testing, you can use any of these emails with password: 12345678"
    );
  } catch (error) {
    console.error("❌ Setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
