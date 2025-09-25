const { query } = require("../connection");

class LeadsService {
  // Get leads with pagination
  static async getLeads(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const result = await query(
        `
        SELECT * FROM leads 
        WHERE status = 'ACTIVE'
        ORDER BY create_ts DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset]
      );

      const countResult = await query(`
        SELECT COUNT(*) as total FROM leads WHERE status = 'ACTIVE'
      `);

      return {
        leads: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
      };
    } catch (error) {
      console.error("Error in getLeads:", error);
      throw error;
    }
  }

  // Get lead by UUID
  static async getLeadByUuid(leadsUuid) {
    try {
      const result = await query(
        `
        SELECT * FROM leads 
        WHERE leads_uuid = $1 AND status = 'ACTIVE'
      `,
        [leadsUuid]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in getLeadByUuid:", error);
      throw error;
    }
  }

  // Create new lead
  static async createLead(leadData) {
    try {
      const {
        applicant_first_name,
        applicant_last_name,
        email,
        contact_number,
        service_type,
        nationality,
        country,
        status_in_country,
        created_by_uuid,
        created_by_name,
      } = leadData;

      // Generate leads code
      const leadsCode = `GBL${new Date()
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, "")}${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`;

      const result = await query(
        `
        INSERT INTO leads (
          applicant_first_name, applicant_last_name, email, contact_number,
          service_type, nationality, country, status_in_country,
          leads_code, created_by_uuid, created_by_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `,
        [
          applicant_first_name,
          applicant_last_name,
          email,
          contact_number,
          service_type,
          nationality,
          country,
          status_in_country,
          leadsCode,
          created_by_uuid,
          created_by_name,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error in createLead:", error);
      throw error;
    }
  }

  // Update lead
  static async updateLead(leadsUuid, updateData) {
    try {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(", ");

      const result = await query(
        `
        UPDATE leads 
        SET ${setClause}, insert_ts = CURRENT_TIMESTAMP
        WHERE leads_uuid = $1
        RETURNING *
      `,
        [leadsUuid, ...values]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error in updateLead:", error);
      throw error;
    }
  }

  // Delete lead (soft delete)
  static async deleteLead(leadsUuid) {
    try {
      const result = await query(
        `
        UPDATE leads 
        SET status = 'INACTIVE', insert_ts = CURRENT_TIMESTAMP
        WHERE leads_uuid = $1
        RETURNING *
      `,
        [leadsUuid]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error in deleteLead:", error);
      throw error;
    }
  }

  // Search leads
  static async searchLeads(searchTerm, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const result = await query(
        `
        SELECT * FROM leads 
        WHERE status = 'ACTIVE' AND (
          applicant_first_name ILIKE $1 OR 
          applicant_last_name ILIKE $1 OR 
          email ILIKE $1 OR 
          contact_number ILIKE $1 OR
          leads_code ILIKE $1
        )
        ORDER BY create_ts DESC
        LIMIT $2 OFFSET $3
      `,
        [`%${searchTerm}%`, limit, offset]
      );

      const countResult = await query(
        `
        SELECT COUNT(*) as total FROM leads 
        WHERE status = 'ACTIVE' AND (
          applicant_first_name ILIKE $1 OR 
          applicant_last_name ILIKE $1 OR 
          email ILIKE $1 OR 
          contact_number ILIKE $1 OR
          leads_code ILIKE $1
        )
      `,
        [`%${searchTerm}%`]
      );

      return {
        leads: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
      };
    } catch (error) {
      console.error("Error in searchLeads:", error);
      throw error;
    }
  }
}

module.exports = LeadsService;
