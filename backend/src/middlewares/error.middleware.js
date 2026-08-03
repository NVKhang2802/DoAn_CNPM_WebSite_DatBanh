class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Dữ liệu yêu cầu không hợp lệ', errorCode = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn', errorCode = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Bạn không có quyền truy cập tính năng này', errorCode = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Không tìm thấy tài nguyên yêu cầu', errorCode = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const errorCode = err.errorCode || 'SERVER_ERROR';

  // Sanitize internal raw database errors on Production
  let userMessage = err.message || 'Lỗi hệ thống nội bộ, vui lòng thử lại sau';
  if (isProd && !err.isOperational) {
    userMessage = 'Lỗi hệ thống máy chủ nội bộ. Vui lòng liên hệ quản trị viên.';
  }

  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorCode,
    message: userMessage,
    stack: !isProd ? err.stack : undefined,
  });
};

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  globalErrorHandler,
};
