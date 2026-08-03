const { executeProcedure } = require('../config/db.config');

class UserRepository {
  static async getProfile(makh) {
    const result = await executeProcedure('sp_KhachHang_GetProfile', {
      p_MAKH: makh,
    });
    return result.recordset[0];
  }

  static async updateProfile(makh, data) {
    const result = await executeProcedure('sp_KhachHang_UpdateProfile', {
      p_MAKH: makh,
      p_HOTEN: data.hoten,
      p_EMAIL: data.email,
      p_SDT: data.sdt,
      p_DIACHI: data.diachi,
    });
    return result.recordset[0];
  }

  static async changePassword(makh, newHashedPassword) {
    const result = await executeProcedure('sp_KhachHang_DoiMatKhau', {
      p_MAKH: makh,
      p_MATKHAU_MOI: newHashedPassword,
    });
    return result.recordset[0];
  }
}

module.exports = UserRepository;
