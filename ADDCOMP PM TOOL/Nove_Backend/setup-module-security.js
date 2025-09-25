const axios = require("axios");

async function setupModuleSecurity() {
  console.log("🔧 Setting up module security for ADMIN users...");

  try {
    // First, let's test if the services are running
    console.log("🔍 Checking services...");

    const authHealth = await axios.get("http://localhost:3001/health");
    console.log("✅ Auth service:", authHealth.data.data.status);

    const userHealth = await axios.get("http://localhost:3002/health");
    console.log("✅ User service:", userHealth.data.message);

    // Now let's test login to see the current state
    console.log("🔑 Testing current login state...");

    try {
      const loginResponse = await axios.post(
        "http://localhost:3001/api/v1/authentication/login",
        {
          email: "developer2haleetech@gmail.com",
          password: "12345678",
        }
      );

      console.log("📊 Current user state:");
      console.log("   Email:", loginResponse.data.data.user.email);
      console.log("   Role:", loginResponse.data.data.user.role_value);
      console.log("   Role UUID:", loginResponse.data.data.user.role_uuid);
      console.log(
        "   Module Security Count:",
        loginResponse.data.data.user.module_security.length
      );

      if (loginResponse.data.data.user.module_security.length === 0) {
        console.log(
          "❌ No module security found! This is why the user can't see Company Information."
        );
        console.log(
          "🔧 The SQL file needs to be executed to set up module security."
        );
        console.log("");
        console.log("📋 To fix this, you need to:");
        console.log("1. Execute the SQL file: PM Platform DB.session.sql");
        console.log("2. Or run the SQL commands directly in your database");
        console.log("");
        console.log("🔍 The issue is that the user has:");
        console.log('   - role_value: "ADMIN" ✅');
        console.log("   - role_uuid: null ❌ (should be linked to ADMIN role)");
        console.log("   - module_security: [] ❌ (should have 25+ modules)");
      } else {
        console.log("✅ Module security is properly configured!");
        console.log("📋 Available modules:");
        loginResponse.data.data.user.module_security.forEach((module) => {
          console.log(`   - ${module.module_name} > ${module.submodule_name}`);
        });
      }
    } catch (loginError) {
      console.log(
        "❌ Login failed:",
        loginError.response?.data?.error?.message || loginError.message
      );
      console.log(
        "🔧 This might be because the database connection is not properly configured."
      );
    }
  } catch (error) {
    console.log("❌ Error checking services:", error.message);
  }
}

setupModuleSecurity();
