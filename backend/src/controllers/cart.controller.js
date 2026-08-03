const CartService = require('../services/cart.service');

class CartController {
  static async getCart(req, res, next) {
    try {
      const cart = await CartService.getCart(req.user.userId);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req, res, next) {
    try {
      const { masp, soluong, kichco } = req.body;
      const cart = await CartService.addToCart(req.user.userId, masp, soluong, kichco);
      res.status(200).json({
        success: true,
        message: 'Đã thêm sản phẩm vào giỏ hàng',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req, res, next) {
    try {
      const { masp } = req.params;
      const cart = await CartService.removeItem(req.user.userId, masp === 'clear' ? null : masp);
      res.status(200).json({
        success: true,
        message: masp === 'clear' ? 'Đã xóa toàn bộ giỏ hàng' : 'Đã xóa sản phẩm khỏi giỏ hàng',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
