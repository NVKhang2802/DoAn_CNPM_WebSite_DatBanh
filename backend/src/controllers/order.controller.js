const OrderService = require('../services/order.service');

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const data = {
        ...req.body,
        makh: req.user.userId,
      };
      const result = await OrderService.createOrder(data);
      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { madh } = req.params;
      const { trangthai } = req.body;
      const result = await OrderService.updateOrderStatus(madh, trangthai, req.user.userId);
      res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrderByCustomer(req, res, next) {
    try {
      const { madh } = req.params;
      const { lydo } = req.body;
      const result = await OrderService.cancelOrderByCustomer(madh, req.user.userId, lydo);
      res.status(200).json({
        success: true,
        message: 'Hủy đơn hàng thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req, res, next) {
    try {
      const orders = await OrderService.getOrders(req.user.userId, req.query.trangthai);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    try {
      const orders = await OrderService.getOrders(req.query.makh || null, req.query.trangthai || null);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderDetail(req, res, next) {
    try {
      const detail = await OrderService.getOrderDetail(req.params.madh, req.user);
      res.status(200).json({
        success: true,
        data: detail,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
