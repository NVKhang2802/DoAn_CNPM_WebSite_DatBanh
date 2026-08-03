const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');
const { BadRequestError } = require('../middlewares/error.middleware');

class UserService {
  static async getProfile(makh) {
    const profile = await UserRepository.getProfile(makh);
    if (!profile) {
      throw new BadRequestError('Không tìm thấy thông tin hồ sơ cá nhân.');
    }
    // Omit sensitive password hash before returning profile to client
    const { MATKHAU_HASH, ...safeProfile } = profile;
    return safeProfile;
  }

  static async updateProfile(makh, data) {
    if (!data.hoten || !data.email) {
      throw new BadRequestError('Họ tên và Email là thông tin bắt buộc.');
    }
    const updated = await UserRepository.updateProfile(makh, data);
    if (updated) {
      delete updated.MATKHAU_HASH;
    }
    return updated;
  }

  static async changePassword(makh, currentPassword, newPassword) {
    if (!currentPassword) {
      throw new BadRequestError('Vui lòng nhập Mật khẩu hiện tại.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestError('Mật khẩu mới phải từ 6 ký tự trở lên.');
    }

    const currentProfile = await UserRepository.getProfile(makh);
    if (!currentProfile || !currentProfile.MATKHAU_HASH) {
      throw new BadRequestError('Không tìm thấy tài khoản người dùng.');
    }

    // Secure Verification of Current Password (SEC-004 Fix)
    let isMatch = false;
    if (currentProfile.MATKHAU_HASH.startsWith('$2a$') || currentProfile.MATKHAU_HASH.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(currentPassword, currentProfile.MATKHAU_HASH);
    } else {
      // Legacy plain text fallback check
      isMatch = currentPassword === currentProfile.MATKHAU_HASH;
    }

    if (!isMatch) {
      throw new BadRequestError('Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.');
    }

    // Hash New Password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    return await UserRepository.changePassword(makh, hashedNew);
  }
}

module.exports = UserService;
