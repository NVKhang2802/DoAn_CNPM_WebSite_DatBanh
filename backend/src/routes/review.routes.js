const express = require('express');
const ReviewController = require('../controllers/review.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

const router = express.Router();

router.get('/product/:masp', ReviewController.getProductReviews);
router.post('/add', authenticateToken, ReviewController.addReview);
router.put('/reply/:madg', authenticateToken, requireRole(['ADMIN', 'QUẢN LÝ', 'NHÂN VIÊN']), ReviewController.replyReview);

module.exports = router;
