const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
    },
  },
});

async function testModuleSecurity() {
  try {
    console.log("Testing module security query...");

    const moduleSecurity = await prisma.module_security.findMany({
      where: {
        role_uuid: "9ed3eb5c-8d76-49b2-b8ea-3c726eba2901",
        status: "ACTIVE",
      },
      select: {
        role_module_id: true,
        module_key: true,
        module_name: true,
        submodule_name: true,
        show_module: true,
        view_access: true,
        edit_access: true,
      },
    });

    console.log("Found module security records:", moduleSecurity.length);
    console.log("Sample records:", moduleSecurity.slice(0, 3));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testModuleSecurity();
