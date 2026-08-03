const AdminRepository = require('../repositories/admin.repository');

class AdminService {
  static async getDashboardData() {
    return await AdminRepository.getDashboardData();
  }

  static async getLoginLogs() {
    return await AdminRepository.getLoginLogs();
  }
}

module.exports = AdminService;
