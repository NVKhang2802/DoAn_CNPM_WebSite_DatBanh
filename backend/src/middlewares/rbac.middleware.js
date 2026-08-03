const { ForbiddenError } = require('./error.middleware');

/**
 * Middleware Phân quyền dựa trên Vai trò (Role-Based Access Control)
 * @param {Array<string>} allowedRoles - Danh sách các quyền được phép (ví dụ: ['ADMIN', 'QUẢN LÝ', 'EMPLOYEE'])
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ForbiddenError('Bạn chưa đăng nhập hoặc không có vai trò hợp lệ.'));
    }

    const userRole = req.user.role.toUpperCase();
    const hasRole = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);

    if (!hasRole) {
      return next(new ForbiddenError(`Vai trò '${userRole}' của bạn không được phép thực hiện chức năng này.`));
    }

    next();
  };
};

module.exports = { requireRole };
