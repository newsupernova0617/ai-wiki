const express = require('express');
const router = express.Router();
const { createDocument, getDocumentById, getAllDocuments, updateDocument,  getDocumentHistory } = require('../controllers/documentController');
const authenticateToken = require('../middlewares/authMiddleware');

// 문서 작성 (로그인 필요)
router.post('/documents', authenticateToken, createDocument);

// 문서 하나 보기 (공개)
router.get('/documents/:id', getDocumentById);

// 문서 리스트 보기 (공개)
router.get('/documents', getAllDocuments);

router.put('/documents/:id', authenticateToken, updateDocument);

// 문서 수정 기록 보기 (공개)
router.get('/documents/:id/history', getDocumentHistory);

module.exports = router;
