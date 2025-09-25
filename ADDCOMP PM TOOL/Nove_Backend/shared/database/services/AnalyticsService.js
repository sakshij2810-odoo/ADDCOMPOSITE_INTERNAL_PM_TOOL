const { query } = require("../connection");

class AnalyticsService {
  // Get analytics data by date range
  static async getAnalyticsData(fromDate, toDate) {
    try {
      const result = await query(
        `
        SELECT 
          metric_name,
          metric_value,
          growth_percentage
        FROM analytics_data 
        WHERE date_from <= $1 AND date_to >= $2
        ORDER BY metric_name
      `,
        [toDate, fromDate]
      );

      return result.rows;
    } catch (error) {
      console.error("Error in getAnalyticsData:", error);
      throw error;
    }
  }

  // Get all analytics metrics
  static async getAllAnalyticsMetrics() {
    try {
      const result = await query(`
        SELECT 
          metric_name,
          metric_value,
          growth_percentage,
          date_from,
          date_to
        FROM analytics_data 
        ORDER BY metric_name, date_from DESC
      `);

      return result.rows;
    } catch (error) {
      console.error("Error in getAllAnalyticsMetrics:", error);
      throw error;
    }
  }

  // Update analytics metric
  static async updateAnalyticsMetric(
    metricName,
    metricValue,
    growthPercentage,
    fromDate,
    toDate
  ) {
    try {
      const result = await query(
        `
        INSERT INTO analytics_data (
          metric_name, metric_value, growth_percentage, date_from, date_to
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (metric_name, date_from, date_to) DO UPDATE SET
          metric_value = EXCLUDED.metric_value,
          growth_percentage = EXCLUDED.growth_percentage,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `,
        [metricName, metricValue, growthPercentage, fromDate, toDate]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error in updateAnalyticsMetric:", error);
      throw error;
    }
  }

  // Get dashboard analytics summary
  static async getDashboardAnalytics() {
    try {
      const result = await query(`
        SELECT 
          metric_name,
          SUM(metric_value) as total_value,
          AVG(growth_percentage) as avg_growth
        FROM analytics_data 
        WHERE date_from >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY metric_name
        ORDER BY metric_name
      `);

      return result.rows;
    } catch (error) {
      console.error("Error in getDashboardAnalytics:", error);
      throw error;
    }
  }

  // Get analytics trends over time
  static async getAnalyticsTrends(metricName, days = 30) {
    try {
      const result = await query(
        `
        SELECT 
          date_from,
          date_to,
          metric_value,
          growth_percentage
        FROM analytics_data 
        WHERE metric_name = $1 
        AND date_from >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY date_from ASC
      `,
        [metricName]
      );

      return result.rows;
    } catch (error) {
      console.error("Error in getAnalyticsTrends:", error);
      throw error;
    }
  }

  // Calculate growth percentage
  static async calculateGrowthPercentage(
    metricName,
    currentValue,
    previousValue
  ) {
    try {
      if (!previousValue || previousValue === 0) {
        return 0;
      }

      const growthPercentage =
        ((currentValue - previousValue) / previousValue) * 100;
      return Math.round(growthPercentage * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error("Error in calculateGrowthPercentage:", error);
      return 0;
    }
  }
}

module.exports = AnalyticsService;
