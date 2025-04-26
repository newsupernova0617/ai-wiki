const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✨ 비밀번호 강도 체크 함수
const isPasswordStrong = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  
const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // ✨ 비밀번호 강도 검사 추가
  if (!isPasswordStrong(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long and include both letters and numbers.' 
    });
  }
  
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
      `INSERT INTO users (email, password_hash) VALUES (?, ?)`,
      [email, hashedPassword],
      function (err) {
        if (err) {
          console.error(err.message);
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists.' });
          }
          return res.status(500).json({ error: 'Database error.' });
        }

        return res.status(201).json({ message: 'User registered successfully.' });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// ✨ 추가되는 로그인 기능
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // 이메일로 사용자 조회
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 비밀번호 검증
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // 토큰 1시간 유효
    );

    return res.json({ token });
  });
};

module.exports = { signup, login };
