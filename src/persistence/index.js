const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const location = __dirname + "/quiz.db";

let db;

function init() {
  const dirName = require("path").dirname(location);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  return new Promise((acc, rej) => {
    db = new sqlite3.Database(location, (err) => {
      if (err) return rej(err);

      if (process.env.NODE_ENV !== "test")
        console.log(`Using sqlite database at ${location}`);

      db.run(
        "CREATE TABLE IF NOT EXISTS quiz_items (id varchar(36), name varchar(255), completed boolean)",
        (err, result) => {
          if (err) return rej(err);
          acc();
        }
      );
    });
  });
}

async function teardown() {
  return new Promise((acc, rej) => {
    db.close((err) => {
      if (err) rej(err);
      else acc();
    });
  });
}

async function getItems() {
  return new Promise((acc, rej) => {
    db.all("SELECT * FROM quiz_items", (err, rows) => {
      if (err) return rej(err);
      acc(rows);
    });
  });
}

module.exports = {
  init,
  teardown,
  getItems,
};
