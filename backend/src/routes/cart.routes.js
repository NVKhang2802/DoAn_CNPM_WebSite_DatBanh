const express = require('express');
const CartController = require('../controllers/cart.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.delete('/item/:masp', CartController.removeItem);

module.exports = router;
