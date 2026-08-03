const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['ADMIN', 'QUẢN LÝ']));

router.get('/dashboard', AdminController.getDashboardData);
router.get('/logs', AdminController.getLoginLogs);

module.exports = router;
