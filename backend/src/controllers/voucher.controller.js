const VoucherService = require('../services/voucher.service');

class VoucherController {
  static async applyVoucher(req, res, next) {
    try {
      const { makm, tongtien } = req.body;
      const result = await VoucherService.checkVoucher(makm, tongtien);
      res.status(200).json({
        success: true,
        message: `Đã áp dụng thành công mã giảm giá ${result.MAKM}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VoucherController;
