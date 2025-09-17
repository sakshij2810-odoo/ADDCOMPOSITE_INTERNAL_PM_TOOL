import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create dummy users
  const users = [
    {
      googleId: "google_123456789",
      email: "sakshi.jadhav@addcomposites.com",
      name: "Sakshi Jadhav",
      firstName: "Sakshi",
      lastName: "Jadhav",
      role: UserRole.ADMIN,
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
      role: UserRole.PROJECT_MANAGER,
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
      role: UserRole.EMPLOYEE,
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
      role: UserRole.EMPLOYEE,
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
      role: UserRole.EMPLOYEE,
      department: "Quality Assurance",
      position: "QA Engineer",
      phone: "+1-555-0105",
      isActive: true,
    },
    {
      googleId: "google_654987321",
      email: "david.brown@addcomposites.com",
      name: "David Brown",
      firstName: "David",
      lastName: "Brown",
      role: UserRole.PROJECT_MANAGER,
      department: "Engineering",
      position: "Technical Lead",
      phone: "+1-555-0106",
      isActive: true,
    },
    {
      googleId: "google_147258369",
      email: "lisa.garcia@addcomposites.com",
      name: "Lisa Garcia",
      firstName: "Lisa",
      lastName: "Garcia",
      role: UserRole.EMPLOYEE,
      department: "Marketing",
      position: "Marketing Specialist",
      phone: "+1-555-0107",
      isActive: true,
    },
    {
      googleId: "google_369258147",
      email: "robert.taylor@addcomposites.com",
      name: "Robert Taylor",
      firstName: "Robert",
      lastName: "Taylor",
      role: UserRole.EMPLOYEE,
      department: "Sales",
      position: "Sales Representative",
      phone: "+1-555-0108",
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

  console.log("🎉 Database seed completed!");
  console.log("\n📋 Created Users:");
  console.log("1. Sakshi Jadhav (Admin) - sakshi.jadhav@addcomposites.com");
  console.log("2. John Doe (Project Manager) - john.doe@addcomposites.com");
  console.log("3. Jane Smith (Employee) - jane.smith@addcomposites.com");
  console.log("4. Mike Wilson (Employee) - mike.wilson@addcomposites.com");
  console.log("5. Sarah Johnson (Employee) - sarah.johnson@addcomposites.com");
  console.log(
    "6. David Brown (Project Manager) - david.brown@addcomposites.com"
  );
  console.log("7. Lisa Garcia (Employee) - lisa.garcia@addcomposites.com");
  console.log("8. Robert Taylor (Employee) - robert.taylor@addcomposites.com");
  console.log("\n🔑 Login Credentials:");
  console.log(
    "For testing, you can use any of these emails with password: 12345678"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
