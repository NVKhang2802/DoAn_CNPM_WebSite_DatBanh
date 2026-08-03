const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { tendn, matkhau } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';
      const result = await AuthService.login(tendn, matkhau, ipAddress);
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
