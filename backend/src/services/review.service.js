const ReviewRepository = require('../repositories/review.repository');
const { BadRequestError } = require('../middlewares/error.middleware');

class ReviewService {
  static async addReview(data) {
    if (!data.sosao || data.sosao < 1 || data.sosao > 5) {
      throw new BadRequestError('Số sao đánh giá phải từ 1 đến 5 sao.');
    }
    return await ReviewRepository.addReview(data);
  }

  static async replyReview(madg, phanhoi) {
    if (!phanhoi) {
      throw new BadRequestError('Nội dung phản hồi không được để trống.');
    }
    return await ReviewRepository.replyReview(madg, phanhoi);
  }

  static async getProductReviews(masp) {
    return await ReviewRepository.getProductReviews(masp);
  }
}

module.exports = ReviewService;
