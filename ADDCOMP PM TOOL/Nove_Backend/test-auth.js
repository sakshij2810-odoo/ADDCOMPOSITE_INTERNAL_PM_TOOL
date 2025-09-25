const {
  PrismaClient,
} = require("./microservices/auth-service/node_modules/@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@localhost:5432/pm_platform",
    },
  },
});

async function testAuth() {
  try {
    console.log("🔍 Testing database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Connected to database successfully!");

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: "sakshi.jadhav@addcomposites.com" },
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        password_hash: true,
        status: true,
        role_value: true,
        first_name: true,
        last_name: true,
        full_name: true,
      },
    });

    console.log("👤 User found:", user);

    if (user) {
      // Test password verification
      const testPassword = "password123";
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log("🔐 Password verification:", isValid);

      if (isValid) {
        console.log("✅ Login would succeed!");
      } else {
        console.log("❌ Login would fail - password mismatch");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
