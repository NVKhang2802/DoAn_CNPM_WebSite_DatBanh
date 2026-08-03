const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./error.middleware');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return next(new UnauthorizedError('Thiếu Token xác thực. Vui lòng đăng nhập lại.'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new UnauthorizedError('Token đã hết hạn hoặc không hợp lệ.'));
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
