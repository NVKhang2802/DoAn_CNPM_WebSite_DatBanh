const { executeProcedure } = require('../config/db.config');

class ReviewRepository {
  static async addReview(data) {
    const result = await executeProcedure('sp_DanhGia_ThemMoi', {
      p_MASP: data.masp,
      p_MAKH: data.makh,
      p_SOSAO: parseInt(data.sosao, 10),
      p_BINHLUAN: data.binhluan,
    });
    return result.recordset[0];
  }

  static async replyReview(madg, phanhoi) {
    const result = await executeProcedure('sp_DanhGia_PhanHoiAdmin', {
      p_MADG: madg,
      p_PHANHOI: phanhoi,
    });
    return result.recordset[0];
  }

  static async getProductReviews(masp) {
    const result = await executeProcedure('sp_DanhGia_GetByProduct', {
      p_MASP: masp,
    });
    return result.recordset;
  }
}

module.exports = ReviewRepository;
