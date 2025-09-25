const axios = require("axios");

async function testServices() {
  console.log("🧪 Quick Service Test");
  console.log("====================");

  // Test Auth Service
  try {
    console.log("🔐 Testing Auth Service...");
    const authResponse = await axios.get("http://localhost:3001/health", {
      timeout: 5000,
    });
    console.log("✅ Auth Service:", authResponse.data);
  } catch (error) {
    console.log("❌ Auth Service Error:", error.message);
  }

  // Test User Service
  try {
    console.log("👤 Testing User Service...");
    const userResponse = await axios.get("http://localhost:3002/health", {
      timeout: 5000,
    });
    console.log("✅ User Service:", userResponse.data);
  } catch (error) {
    console.log("❌ User Service Error:", error.message);
  }

  // Test Login
  try {
    console.log("🔑 Testing Login...");
    const loginResponse = await axios.post(
      "http://localhost:3001/api/v1/authentication/login",
      {
        email: "developer2haleetech@gmail.com",
        password: "12345678",
      },
      { timeout: 10000 }
    );
    console.log("✅ Login Success:", loginResponse.data.success);
    if (loginResponse.data.success) {
      console.log("   User:", loginResponse.data.data.user.email);
      console.log("   Role:", loginResponse.data.data.user.role_value);
      console.log(
        "   Modules:",
        loginResponse.data.data.user.module_security.length
      );
    }
  } catch (error) {
    console.log(
      "❌ Login Error:",
      error.response?.data?.error?.message || error.message
    );
  }
}

testServices();
