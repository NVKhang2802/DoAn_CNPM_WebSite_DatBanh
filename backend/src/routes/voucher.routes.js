const express = require('express');
const VoucherController = require('../controllers/voucher.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);
router.post('/apply', VoucherController.applyVoucher);

module.exports = router;
