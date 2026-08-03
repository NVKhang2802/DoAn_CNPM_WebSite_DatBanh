const { executeProcedure } = require('../config/db.config');

class CartRepository {
  static async getCart(makh) {
    const result = await executeProcedure('sp_GioHang_GetDetail', {
      p_MAKH: makh,
    });
    return result.recordset;
  }

  static async addToCart(makh, masp, soluong = 1, kichco = null) {
    await executeProcedure('sp_GioHang_ThemSanPham', {
      p_MAKH: makh,
      p_MASP: masp,
      p_SOLUONG: parseInt(soluong, 10),
      p_KICHCO: kichco,
    });
  }

  static async removeItem(makh, masp = null) {
    await executeProcedure('sp_GioHang_XoaItem', {
      p_MAKH: makh,
      p_MASP: masp,
    });
  }
}

module.exports = CartRepository;
