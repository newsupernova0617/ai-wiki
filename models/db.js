const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 연결 (없으면 자동 생성)
const db = new sqlite3.Database(path.resolve(__dirname, '../database.sqlite'), (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

module.exports = db;
