const AdminService = require('../services/admin.service');

class AdminController {
  static async getDashboardData(req, res, next) {
    try {
      const data = await AdminService.getDashboardData();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLoginLogs(req, res, next) {
    try {
      const logs = await AdminService.getLoginLogs();
      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
