const express = require('express');
const ProductController = require('../controllers/product.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductDetail);

// Admin / Employee product management
router.post('/upsert', authenticateToken, requireRole(['ADMIN', 'QUẢN LÝ', 'NHÂN VIÊN']), upload.single('image'), ProductController.upsertProduct);

module.exports = router;
