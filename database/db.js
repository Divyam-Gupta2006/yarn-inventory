const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// DB file location
const dbPath = path.join(__dirname, "inventory.db");

// Connect DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB Error:", err.message);
  } else {
    console.log("Connected to SQLite DB");
  }
});

// Create Tables
db.serialize(() => {
  // BALES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS bales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT,
        yarn_type TEXT,
        shade TEXT,
        lot TEXT,
        weight_per_bundle REAL,
        bundles INTEGER,
        nett_weight REAL,
        gross_weight REAL,
        bale_number TEXT,
        date TEXT,
        remaining_weight REAL
    )
  `);

  // SALES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      party_name TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // SALE ITEMS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      bale_id INTEGER,
      weight_sold REAL,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (bale_id) REFERENCES bales(id)
    )
  `);

  // USERS TABLE (optional login)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )
  `);
});

module.exports = db;
