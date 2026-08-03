const express = require('express');
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/change-password', UserController.changePassword);

module.exports = router;
