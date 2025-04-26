const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // 요청 헤더에서 Authorization 토큰 꺼내기
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰에서 'Bearer ' 제외

  if (!token) {
    return res.status(401).json({ error: 'Access token missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    // 토큰 복호화 성공 → 유저 정보 저장
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
