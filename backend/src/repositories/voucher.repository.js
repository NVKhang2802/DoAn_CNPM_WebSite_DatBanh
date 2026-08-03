const { executeProcedure } = require('../config/db.config');

class VoucherRepository {
  static async checkVoucher(makm, tongtien) {
    const result = await executeProcedure('sp_Voucher_KiemTra', {
      p_MAKM: makm,
      p_TONGTIEN: parseFloat(tongtien),
    });
    return result.recordset[0];
  }
}

module.exports = VoucherRepository;
