const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('../repositories/auth.repository');
const { executeProcedure } = require('../config/db.config');
const { BadRequestError, UnauthorizedError } = require('../middlewares/error.middleware');

class AuthService {
  static async register(data) {
    if (!data.tendn || !data.matkhau || !data.hoten || !data.email) {
      throw new BadRequestError('Vui lòng điền đầy đủ các thông tin bắt buộc: Họ tên, Tên đăng nhập, Mật khẩu, Email.');
    }

    if (data.matkhau.length < 6) {
      throw new BadRequestError('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
    }

    const hashedPassword = await bcrypt.hash(data.matkhau, 10);

    const newUser = await AuthRepository.dangKy({
      ...data,
      matkhau: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser.MAKH, tendn: newUser.TENDN, role: 'CUSTOMER' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { user: newUser, token };
  }

  static async login(tendn, matkhau, ipAddress) {
    if (!tendn || !matkhau) {
      throw new BadRequestError('Vui lòng nhập Tên đăng nhập và Mật khẩu.');
    }

    let user;
    try {
      user = await AuthRepository.dangNhap(tendn, ipAddress);
    } catch (err) {
      await AuthRepository.capNhatKetQuaDangNhap(tendn, false, ipAddress);
      throw new UnauthorizedError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    if (user.TRANGTHAI === 'BỊ KHÓA') {
      throw new UnauthorizedError('Tài khoản này đã bị khóa do nhập sai mật khẩu quá 5 lần. Vui lòng liên hệ Admin.');
    }

    // Verify Password (bcrypt or legacy plain text fallback)
    let isMatch = false;
    let isLegacyPlain = false;

    if (user.MATKHAU && (user.MATKHAU.startsWith('$2a$') || user.MATKHAU.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(matkhau, user.MATKHAU);
    } else {
      // Legacy plain text check
      isMatch = matkhau === user.MATKHAU;
      if (isMatch) isLegacyPlain = true;
    }

    if (!isMatch) {
      await AuthRepository.capNhatKetQuaDangNhap(tendn, false, ipAddress);
      throw new UnauthorizedError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    // Dynamic Re-hash for legacy plain-text passwords upon successful login!
    if (isLegacyPlain) {
      try {
        const newHash = await bcrypt.hash(matkhau, 10);
        await executeProcedure('sp_TaiKhoan_CapNhatMatKhauBcrypt', {
          p_TENDN: tendn,
          p_MATKHAU_BCRYPT: newHash,
        });
        console.log(`[Auto Re-hash] Upgraded legacy password for user '${tendn}' to bcrypt!`);
      } catch (rehashErr) {
        console.warn('[Auto Re-hash Warning]:', rehashErr.message);
      }
    }

    // Update log & reset failed count
    await AuthRepository.capNhatKetQuaDangNhap(tendn, true, ipAddress);

    const role = user.ROLE ? user.ROLE.toUpperCase() : 'CUSTOMER';
    const token = jwt.sign(
      { userId: user.USER_ID, tendn: user.TENDN, role, hoten: user.HOTEN, email: user.EMAIL, sdt: user.SDT, diachi: user.DIACHI },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return {
      user: {
        userId: user.USER_ID,
        hoten: user.HOTEN,
        tendn: user.TENDN,
        email: user.EMAIL,
        sdt: user.SDT,
        diachi: user.DIACHI,
        role,
      },
      token,
    };
  }
}

module.exports = AuthService;
