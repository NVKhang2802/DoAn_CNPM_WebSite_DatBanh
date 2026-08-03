const ReviewService = require('../services/review.service');

class ReviewController {
  static async addReview(req, res, next) {
    try {
      const data = {
        ...req.body,
        makh: req.user.userId,
      };
      const result = await ReviewService.addReview(data);
      res.status(201).json({
        success: true,
        message: 'Gửi đánh giá thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async replyReview(req, res, next) {
    try {
      const { madg } = req.params;
      const { phanhoi } = req.body;
      const result = await ReviewService.replyReview(madg, phanhoi);
      res.status(200).json({
        success: true,
        message: 'Gửi phản hồi thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductReviews(req, res, next) {
    try {
      const reviews = await ReviewService.getProductReviews(req.params.masp);
      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;
