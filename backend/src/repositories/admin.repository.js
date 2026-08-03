const { executeProcedure } = require('../config/db.config');

class AdminRepository {
  static async getDashboardData() {
    const result = await executeProcedure('sp_Admin_ThongKeDashboard');
    return {
      overview: result.recordsets[0] ? result.recordsets[0][0] : null,
      topProducts: result.recordsets[1] || [],
    };
  }

  static async getLoginLogs() {
    const result = await executeProcedure('sp_Admin_GetLoginLogs');
    return result.recordset;
  }
}

module.exports = AdminRepository;
