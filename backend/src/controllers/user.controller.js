const UserService = require('../services/user.service');

class UserController {
  static async getProfile(req, res, next) {
    try {
      const profile = await UserService.getProfile(req.user.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updated = await UserService.updateProfile(req.user.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Cập nhật hồ sơ cá nhân thành công!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changePassword(req.user.userId, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Đổi mật khẩu thành công!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
