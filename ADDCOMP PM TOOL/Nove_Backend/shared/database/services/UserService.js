const { query } = require("../connection");

class UserService {
  // Get user by email and password
  static async authenticateUser(email, password) {
    try {
      const result = await query(
        "SELECT * FROM users WHERE email = $1 AND status = $2",
        [email, "ACTIVE"]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      // In a real app, you would verify the password hash here
      // For now, we'll use a simple password check
      if (password === "12345678") {
        return user;
      }

      return null;
    } catch (error) {
      console.error("Error authenticating user:", error);
      throw error;
    }
  }

  // Get user by UUID
  static async getUserByUuid(userUuid, status = "ACTIVE") {
    try {
      const result = await query(
        "SELECT * FROM users WHERE user_uuid = $1 AND status = $2",
        [userUuid, status]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error getting user by UUID:", error);
      throw error;
    }
  }

  // Get user with module security
  static async getUserWithModuleSecurity(userUuid, status = "ACTIVE") {
    try {
      const userResult = await query(
        "SELECT * FROM users WHERE user_uuid = $1 AND status = $2",
        [userUuid, status]
      );

      if (userResult.rows.length === 0) {
        return null;
      }

      const user = userResult.rows[0];

      // Get module security for the user
      const moduleSecurityResult = await query(
        "SELECT * FROM module_security WHERE role_uuid = $1 AND status = $2",
        [user.role_uuid, "ACTIVE"]
      );

      user.module_security = moduleSecurityResult.rows;

      return user;
    } catch (error) {
      console.error("Error getting user with module security:", error);
      throw error;
    }
  }

  // Create a new user
  static async createUser(userData) {
    try {
      const result = await query(
        `INSERT INTO users (
          user_fact_unique_id, email, password_hash, status, 
          created_by_uuid, created_by_name, role_uuid, role_value,
          first_name, last_name, full_name, personal_email,
          branch_name, branch_uuid, referral_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          userData.user_fact_unique_id,
          userData.email,
          userData.password_hash,
          userData.status || "ACTIVE",
          userData.created_by_uuid,
          userData.created_by_name,
          userData.role_uuid,
          userData.role_value,
          userData.first_name,
          userData.last_name,
          userData.full_name,
          userData.personal_email,
          userData.branch_name,
          userData.branch_uuid,
          userData.referral_code,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userUuid, updateData) {
    try {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(", ");

      const result = await query(
        `UPDATE users SET ${setClause}, insert_ts = CURRENT_TIMESTAMP 
         WHERE user_uuid = $1 RETURNING *`,
        [userUuid, ...values]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Delete user (soft delete)
  static async deleteUser(userUuid) {
    try {
      const result = await query(
        "UPDATE users SET status = $1, insert_ts = CURRENT_TIMESTAMP WHERE user_uuid = $2 RETURNING *",
        ["INACTIVE", userUuid]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

module.exports = UserService;
