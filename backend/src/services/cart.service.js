const CartRepository = require('../repositories/cart.repository');

class CartService {
  static async getCart(makh) {
    const items = await CartRepository.getCart(makh);
    const totalAmount = items.reduce((sum, item) => sum + (item.THANHTIEN || 0), 0);
    return { items, totalAmount };
  }

  static async addToCart(makh, masp, soluong, kichco) {
    await CartRepository.addToCart(makh, masp, soluong, kichco);
    return await this.getCart(makh);
  }

  static async removeItem(makh, masp) {
    await CartRepository.removeItem(makh, masp);
    return await this.getCart(makh);
  }
}

module.exports = CartService;
