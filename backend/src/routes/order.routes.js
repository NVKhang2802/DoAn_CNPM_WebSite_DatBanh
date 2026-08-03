const express = require('express');
const OrderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/checkout', OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/detail/:madh', OrderController.getOrderDetail);
router.put('/cancel/:madh', OrderController.cancelOrderByCustomer);

// Admin / Employee routes
router.get('/all', requireRole(['ADMIN', 'QUẢN LÝ', 'NHÂN VIÊN']), OrderController.getAllOrders);
router.put('/status/:madh', requireRole(['ADMIN', 'QUẢN LÝ', 'NHÂN VIÊN']), OrderController.updateOrderStatus);

module.exports = router;
