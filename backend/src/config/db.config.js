const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME || 'QL_BANH',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword123',
  options: {
    encrypt: false,
    trustServerCertificate: (process.env.DB_TRUST_SERVER_CERTIFICATE || 'true') === 'true',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise = null;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then((pool) => {
        console.log(`[SQL Server] Connected successfully to database '${dbConfig.database}' on '${dbConfig.server}'`);
        return pool;
      })
      .catch((err) => {
        console.error('[SQL Server Connection Error]:', err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
};

/**
 * Helper to execute a SQL Stored Procedure safely
 * @param {string} procedureName - Name of the Stored Procedure (e.g. 'sp_TaiKhoan_DangNhap')
 * @param {Object} inputs - Key-value pair of inputs (e.g. { p_TENDN: 'an01', p_MATKHAU: '123' })
 */
const executeProcedure = async (procedureName, inputs = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Attach all parameters dynamically
    Object.keys(inputs).forEach((key) => {
      const val = inputs[key];
      if (typeof val === 'number') {
        if (Number.isInteger(val)) {
          request.input(key, sql.Int, val);
        } else {
          request.input(key, sql.Decimal(18, 2), val);
        }
      } else if (typeof val === 'boolean') {
        request.input(key, sql.Bit, val);
      } else if (val instanceof Date) {
        request.input(key, sql.DateTime, val);
      } else {
        request.input(key, sql.NVarChar, val !== undefined && val !== null ? String(val) : null);
      }
    });

    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error(`[SP Error - ${procedureName}]:`, error.message);
    throw error;
  }
};

module.exports = {
  sql,
  dbConfig,
  getPool,
  executeProcedure,
};
