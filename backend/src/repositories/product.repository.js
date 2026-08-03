const { executeProcedure } = require('../config/db.config');

class ProductRepository {
  static async getProducts(filters) {
    const result = await executeProcedure('sp_SanPham_GetList', {
      p_TUKHOA: filters.tukhoa || null,
      p_MADM: filters.madm || null,
      p_GIA_TU: filters.gia_tu ? parseFloat(filters.gia_tu) : null,
      p_GIA_DEN: filters.gia_den ? parseFloat(filters.gia_den) : null,
      p_TRANGTHAI: filters.trangthai || null,
      p_PAGENUMBER: filters.page ? parseInt(filters.page, 10) : 1,
      p_PAGESIZE: filters.limit ? parseInt(filters.limit, 10) : 20,
      p_SORTBY: filters.sort || 'MOI_NHAT',
    });
    return result.recordset;
  }

  static async getProductDetail(masp) {
    const result = await executeProcedure('sp_SanPham_GetDetail', {
      p_MASP: masp,
    });
    return result.recordset[0];
  }

  static async upsertProduct(data) {
    const result = await executeProcedure('sp_SanPham_Upsert', {
      p_MASP: data.masp || null,
      p_TENSP: data.tensp,
      p_GIA: parseFloat(data.gia),
      p_MOTA: data.mota,
      p_ANHSP: data.anhsp,
      p_KICHCO: data.kichco || 'VỪA',
      p_MAUSAC: data.mausac || 'TỰ NHIÊN',
      p_TRANGTHAI: data.trangthai || 'CÒN HÀNG',
      p_SOLUONGTON: parseInt(data.soluongton, 10) || 100,
    });
    return result.recordset[0];
  }
}

module.exports = ProductRepository;
