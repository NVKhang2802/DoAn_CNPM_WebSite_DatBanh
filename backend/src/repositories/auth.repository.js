const { executeProcedure } = require('../config/db.config');

class AuthRepository {
  static async dangKy(data) {
    const result = await executeProcedure('sp_KhachHang_DangKy', {
      p_HOTEN: data.hoten,
      p_TENDN: data.tendn,
      p_MATKHAU: data.matkhau,
      p_EMAIL: data.email,
      p_SDT: data.sdt,
      p_DIACHI: data.diachi,
    });
    return result.recordset[0];
  }

  static async dangNhap(tendn, ipAddress) {
    const result = await executeProcedure('sp_TaiKhoan_DangNhap', {
      p_TENDN: tendn,
      p_IPADDRESS: ipAddress,
    });
    return result.recordset[0];
  }

  static async capNhatKetQuaDangNhap(tendn, isSuccess, ipAddress) {
    await executeProcedure('sp_TaiKhoan_CapNhatKetQuaDangNhap', {
      p_TENDN: tendn,
      p_IS_SUCCESS: isSuccess,
      p_IPADDRESS: ipAddress,
    });
  }
}

module.exports = AuthRepository;
