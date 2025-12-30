const { getDatabase } = require('../config/database');

const DEFAULT_FREE_IMAGES = 4;
const CREDITS_PER_PURCHASE = 10;

function initDatabase() {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fingerprint TEXT UNIQUE NOT NULL,
      email TEXT,
      remaining_images INTEGER DEFAULT ${DEFAULT_FREE_IMAGES},
      total_generated INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_fingerprint ON users(fingerprint);
    CREATE INDEX IF NOT EXISTS idx_email ON users(email);
  `);

  console.log('Database initialized successfully');
}

function getUserQuota(fingerprint) {
  const db = getDatabase();

  const stmt = db.prepare('SELECT remaining_images FROM users WHERE fingerprint = ?');
  const row = stmt.get(fingerprint);

  if (!row) {
    // Nuevo usuario: crear con imagenes gratuitas
    const insert = db.prepare(
      'INSERT INTO users (fingerprint, remaining_images) VALUES (?, ?)'
    );
    insert.run(fingerprint, DEFAULT_FREE_IMAGES);
    return DEFAULT_FREE_IMAGES;
  }

  return row.remaining_images;
}

function canGenerate(fingerprint) {
  return getUserQuota(fingerprint) > 0;
}

function decrementQuota(fingerprint) {
  const db = getDatabase();

  const stmt = db.prepare(`
    UPDATE users
    SET remaining_images = remaining_images - 1,
        total_generated = total_generated + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE fingerprint = ? AND remaining_images > 0
  `);

  const result = stmt.run(fingerprint);

  if (result.changes > 0) {
    // Retornar el nuevo valor
    return getUserQuota(fingerprint);
  }

  return 0;
}

function addCredits(identifier, amount = CREDITS_PER_PURCHASE, byEmail = false) {
  const db = getDatabase();

  const field = byEmail ? 'email' : 'fingerprint';
  const stmt = db.prepare(`
    UPDATE users
    SET remaining_images = remaining_images + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE ${field} = ?
  `);

  const result = stmt.run(amount, identifier);
  return result.changes > 0;
}

function linkEmail(fingerprint, email) {
  const db = getDatabase();

  const stmt = db.prepare(
    'UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE fingerprint = ?'
  );

  return stmt.run(email, fingerprint);
}

function getUserByEmail(email) {
  const db = getDatabase();

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

function getUserStats(fingerprint) {
  const db = getDatabase();

  const stmt = db.prepare(
    'SELECT remaining_images, total_generated FROM users WHERE fingerprint = ?'
  );
  const row = stmt.get(fingerprint);

  if (!row) {
    return { remaining: DEFAULT_FREE_IMAGES, totalGenerated: 0 };
  }

  return {
    remaining: row.remaining_images,
    totalGenerated: row.total_generated
  };
}

module.exports = {
  initDatabase,
  getUserQuota,
  canGenerate,
  decrementQuota,
  addCredits,
  linkEmail,
  getUserByEmail,
  getUserStats,
  DEFAULT_FREE_IMAGES,
  CREDITS_PER_PURCHASE
};
