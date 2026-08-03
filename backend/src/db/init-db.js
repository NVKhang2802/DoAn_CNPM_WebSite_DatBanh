const fs = require('fs');
const path = require('path');
const { getPool, sql } = require('../config/db.config');

const runScript = async (pool, filePath) => {
  console.log(`[Init DB] Running script: ${path.basename(filePath)}...`);
  const sqlContent = fs.readFileSync(filePath, 'utf8');

  // Split SQL commands by GO keyword
  const batches = sqlContent
    .split(/\bGO\b/i)
    .map((batch) => batch.trim())
    .filter((batch) => batch.length > 0);

  for (const batch of batches) {
    try {
      await pool.request().query(batch);
    } catch (err) {
      console.warn(`[Batch Warning/Error in ${path.basename(filePath)}]:`, err.message);
    }
  }
  console.log(`[Init DB] Finished: ${path.basename(filePath)}`);
};

const initDatabase = async () => {
  try {
    const pool = await getPool();
    const schemaPath = path.join(__dirname, 'schema.sql');
    const proceduresPath = path.join(__dirname, 'procedures.sql');

    await runScript(pool, schemaPath);
    await runScript(pool, proceduresPath);

    console.log('[Init DB] SQL Server Database initialized successfully with all tables & Stored Procedures!');
  } catch (error) {
    console.error('[Init DB Error]:', error.message);
  }
};

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
