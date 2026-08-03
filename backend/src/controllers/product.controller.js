const ProductService = require('../services/product.service');

class ProductController {
  static async getProducts(req, res, next) {
    try {
      const products = await ProductService.getProducts(req.query);
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductDetail(req, res, next) {
    try {
      const product = await ProductService.getProductDetail(req.params.id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async upsertProduct(req, res, next) {
    try {
      const data = {
        ...req.body,
        anhsp: req.file ? `/uploads/${req.file.filename}` : req.body.anhsp,
      };
      const result = await ProductService.upsertProduct(data);
      res.status(200).json({
        success: true,
        message: 'Lưu sản phẩm thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
