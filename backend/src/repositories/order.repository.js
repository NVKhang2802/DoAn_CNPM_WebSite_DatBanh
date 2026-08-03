const { executeProcedure } = require('../config/db.config');

class OrderRepository {
  static async createOrder(data) {
    const result = await executeProcedure('sp_DonHang_TaoMoi', {
      p_MAKH: data.makh,
      p_DIACHIGIAO: data.diachigiao,
      p_SDTNHAN: data.sdtnhan,
      p_PHUONGTHUCTT: data.phuongthuctt || 'TIỀN MẶT',
      p_GHICHU: data.ghichu || null,
      p_MAKM: data.makm || null,
    });
    return result.recordset[0];
  }

  static async updateOrderStatus(madh, trangthaiMoi, manv = null) {
    const result = await executeProcedure('sp_DonHang_CapNhatTrangThai', {
      p_MADH: madh,
      p_TRANGTHAI_MOI: trangthaiMoi,
      p_MANV: manv,
    });
    return result.recordset[0];
  }

  static async cancelOrderByCustomer(madh, makh, lydo = null) {
    const result = await executeProcedure('sp_DonHang_HuyDonKhach', {
      p_MADH: madh,
      p_MAKH: makh,
      p_LYDO: lydo || 'Khách hàng yêu cầu hủy đơn',
    });
    return result.recordset[0];
  }

  static async getOrders(makh = null, trangthai = null) {
    const result = await executeProcedure('sp_DonHang_GetList', {
      p_MAKH: makh,
      p_TRANGTHAI: trangthai,
    });
    return result.recordset;
  }

  static async getOrderDetail(madh) {
    const result = await executeProcedure('sp_DonHang_GetDetail', {
      p_MADH: madh,
    });
    return {
      order: result.recordsets[0] ? result.recordsets[0][0] : null,
      items: result.recordsets[1] || [],
    };
  }
}

module.exports = OrderRepository;
