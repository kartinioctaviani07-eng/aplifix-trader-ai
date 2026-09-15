import Database from "better-sqlite3";

const db = new Database("data/aplifix.db");

const tables = db
  .prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
  `)
  .all();

console.log("=== APLIFIX SQLITE PREFLIGHT ===");
console.log(tables);

db.close();

console.log("=== DATABASE OK ===");
