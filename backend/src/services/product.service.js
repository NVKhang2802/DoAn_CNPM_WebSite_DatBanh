const ProductRepository = require('../repositories/product.repository');
const { NotFoundError } = require('../middlewares/error.middleware');

class ProductService {
  static async getProducts(filters) {
    return await ProductRepository.getProducts(filters);
  }

  static async getProductDetail(masp) {
    const product = await ProductRepository.getProductDetail(masp);
    if (!product) {
      throw new NotFoundError(`Không tìm thấy sản phẩm bánh mã ${masp}`);
    }
    return product;
  }

  static async upsertProduct(data) {
    return await ProductRepository.upsertProduct(data);
  }
}

module.exports = ProductService;
