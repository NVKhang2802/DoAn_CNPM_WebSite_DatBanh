const OrderRepository = require('../repositories/order.repository');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../middlewares/error.middleware');

class OrderService {
  static async createOrder(data) {
    if (!data.diachigiao || !data.sdtnhan) {
      throw new BadRequestError('Vui lòng cung cấp Địa chỉ giao hàng và Số điện thoại người nhận.');
    }
    return await OrderRepository.createOrder(data);
  }

  static async updateOrderStatus(madh, trangthaiMoi, manv) {
    const validStatuses = ['ĐANG XỬ LÝ', 'ĐÃ DUYỆT', 'ĐANG GIAO HÀNG', 'HOÀN THÀNH', 'ĐÃ HỦY'];
    if (!validStatuses.includes(trangthaiMoi)) {
      throw new BadRequestError(`Trạng thái '${trangthaiMoi}' không hợp lệ. Các trạng thái hợp lệ: ${validStatuses.join(', ')}`);
    }
    return await OrderRepository.updateOrderStatus(madh, trangthaiMoi, manv);
  }

  static async cancelOrderByCustomer(madh, makh, lydo) {
    return await OrderRepository.cancelOrderByCustomer(madh, makh, lydo);
  }

  static async getOrders(makh, trangthai) {
    return await OrderRepository.getOrders(makh, trangthai);
  }

  static async getOrderDetail(madh, currentUser) {
    const detail = await OrderRepository.getOrderDetail(madh);
    if (!detail.order) {
      throw new NotFoundError(`Không tìm thấy đơn hàng mã ${madh}`);
    }

    // Ownership & Authorization Check (SEC-003 IDOR Fix)
    if (currentUser) {
      const isStaffOrAdmin = ['ADMIN', 'QUẢN LÝ', 'NHÂN VIÊN'].includes(currentUser.role?.toUpperCase());
      const isOwner = detail.order.MAKH === currentUser.userId;
      if (!isStaffOrAdmin && !isOwner) {
        throw new ForbiddenError('Bạn không có quyền xem thông tin chi tiết của đơn hàng này.');
      }
    }

    return detail;
  }
}

module.exports = OrderService;
