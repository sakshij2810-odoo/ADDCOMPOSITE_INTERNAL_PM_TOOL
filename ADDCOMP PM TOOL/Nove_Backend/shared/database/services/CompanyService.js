const { query } = require("../connection");

class CompanyService {
  // Get public company information
  static async getPublicCompanyInformation() {
    try {
      const result = await query(
        "SELECT * FROM company_information WHERE status = $1 ORDER BY created_at DESC LIMIT 1",
        ["ACTIVE"]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error getting public company information:", error);
      throw error;
    }
  }

  // Get company information by ID
  static async getCompanyInformation(companyId) {
    try {
      const result = await query(
        "SELECT * FROM company_information WHERE company_id = $1 AND status = $2",
        [companyId, "ACTIVE"]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error getting company information:", error);
      throw error;
    }
  }

  // Create or update company information
  static async upsertCompanyInformation(companyData) {
    try {
      const result = await query(
        `INSERT INTO company_information (
          company_name, preview_logo, preview_fav_icon, company_title,
          company_description, adsense_header_code, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (company_name) 
        DO UPDATE SET
          preview_logo = EXCLUDED.preview_logo,
          preview_fav_icon = EXCLUDED.preview_fav_icon,
          company_title = EXCLUDED.company_title,
          company_description = EXCLUDED.company_description,
          adsense_header_code = EXCLUDED.adsense_header_code,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          companyData.company_name,
          companyData.preview_logo,
          companyData.preview_fav_icon,
          companyData.company_title,
          companyData.company_description,
          companyData.adsense_header_code,
          companyData.status || "ACTIVE",
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error upserting company information:", error);
      throw error;
    }
  }

  // Get environment configuration
  static async getEnvironmentConfiguration(environment = "development") {
    try {
      const result = await query(
        "SELECT * FROM environment_configuration WHERE environment = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1",
        [environment, "ACTIVE"]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error getting environment configuration:", error);
      throw error;
    }
  }

  // Create or update environment configuration
  static async upsertEnvironmentConfiguration(configData) {
    try {
      const result = await query(
        `INSERT INTO environment_configuration (
          environment, api_base_url, frontend_url, database_url,
          redis_url, jwt_secret, google_client_id, google_client_secret,
          cors_origin, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (environment) 
        DO UPDATE SET
          api_base_url = EXCLUDED.api_base_url,
          frontend_url = EXCLUDED.frontend_url,
          database_url = EXCLUDED.database_url,
          redis_url = EXCLUDED.redis_url,
          jwt_secret = EXCLUDED.jwt_secret,
          google_client_id = EXCLUDED.google_client_id,
          google_client_secret = EXCLUDED.google_client_secret,
          cors_origin = EXCLUDED.cors_origin,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          configData.environment,
          configData.api_base_url,
          configData.frontend_url,
          configData.database_url,
          configData.redis_url,
          configData.jwt_secret,
          configData.google_client_id,
          configData.google_client_secret,
          configData.cors_origin,
          configData.status || "ACTIVE",
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error upserting environment configuration:", error);
      throw error;
    }
  }
}

module.exports = CompanyService;
