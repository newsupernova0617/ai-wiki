// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const initDB = require('./models/init');
const authRoutes = require('./routes/authRoutes'); // ✅ 추가
const documentRoutes = require('./routes/documentRoutes'); // 추가
const discussionRoutes = require('./routes/discussionRoutes'); // 추가

dotenv.config();
const app = express();
initDB(); // ✅ 앱 시작할 때 DB 테이블 초기화!

app.use(cors());
app.use(express.json());
app.use(express.static('public'))
// ✅ 라우터 등록
app.use('/api', authRoutes);
app.use('/api', documentRoutes); // 추가
app.use('/api', discussionRoutes); // 추가

// 예시 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello Wiki MVP!');
});


// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
