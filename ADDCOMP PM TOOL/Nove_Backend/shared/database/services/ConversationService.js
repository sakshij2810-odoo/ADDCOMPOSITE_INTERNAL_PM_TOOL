const { query } = require("../connection");

class ConversationService {
  // Get conversations for a user
  static async getConversationsByUser(userUuid) {
    try {
      const result = await query(
        "SELECT * FROM conversations WHERE user_uuid = $1 AND status = $2 ORDER BY created_at DESC",
        [userUuid, "ACTIVE"]
      );

      return result.rows;
    } catch (error) {
      console.error("Error getting conversations by user:", error);
      throw error;
    }
  }

  // Get conversation by ID
  static async getConversationById(conversationId) {
    try {
      const result = await query(
        "SELECT * FROM conversations WHERE conversation_id = $1 AND status = $2",
        [conversationId, "ACTIVE"]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error getting conversation by ID:", error);
      throw error;
    }
  }

  // Create a new conversation
  static async createConversation(conversationData) {
    try {
      const result = await query(
        `INSERT INTO conversations (
          user_uuid, conversation_type, title, status, created_by_uuid
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          conversationData.user_uuid,
          conversationData.conversation_type || "GENERAL",
          conversationData.title,
          conversationData.status || "ACTIVE",
          conversationData.created_by_uuid,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }

  // Update conversation
  static async updateConversation(conversationId, updateData) {
    try {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(", ");

      const result = await query(
        `UPDATE conversations SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE conversation_id = $1 RETURNING *`,
        [conversationId, ...values]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error updating conversation:", error);
      throw error;
    }
  }

  // Delete conversation (soft delete)
  static async deleteConversation(conversationId) {
    try {
      const result = await query(
        "UPDATE conversations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE conversation_id = $2 RETURNING *",
        ["INACTIVE", conversationId]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  }

  // Get conversation messages
  static async getConversationMessages(conversationId) {
    try {
      const result = await query(
        "SELECT * FROM conversation_messages WHERE conversation_id = $1 AND status = $2 ORDER BY created_at ASC",
        [conversationId, "ACTIVE"]
      );

      return result.rows;
    } catch (error) {
      console.error("Error getting conversation messages:", error);
      throw error;
    }
  }

  // Add message to conversation
  static async addMessage(messageData) {
    try {
      const result = await query(
        `INSERT INTO conversation_messages (
          conversation_id, user_uuid, message_type, content, status
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          messageData.conversation_id,
          messageData.user_uuid,
          messageData.message_type || "TEXT",
          messageData.content,
          messageData.status || "ACTIVE",
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }
}

module.exports = ConversationService;
