const express = require('express');
const router = express.Router();
const { addDiscussion, getDiscussions } = require('../controllers/discussionController');
const authenticateToken = require('../middlewares/authMiddleware');

// 문서에 토론 추가 (로그인 필요)
router.post('/documents/:id/discussions', authenticateToken, addDiscussion);

// 문서별 토론 리스트 보기 (공개)
router.get('/documents/:id/discussions', getDiscussions);

module.exports = router;
