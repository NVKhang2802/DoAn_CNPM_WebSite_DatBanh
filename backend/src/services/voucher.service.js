const VoucherRepository = require('../repositories/voucher.repository');
const { BadRequestError } = require('../middlewares/error.middleware');

class VoucherService {
  static async checkVoucher(makm, tongtien) {
    if (!makm || !tongtien) {
      throw new BadRequestError('Vui lòng cung cấp Mã voucher và Tổng tiền đơn hàng.');
    }
    return await VoucherRepository.checkVoucher(makm.trim().toUpperCase(), tongtien);
  }
}

module.exports = VoucherService;
