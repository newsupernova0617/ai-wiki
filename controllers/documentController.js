const db = require('../models/db');

// 문서 작성
const createDocument = (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id; // JWT 미들웨어에서 복호화된 사용자 정보

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const now = new Date().toISOString();

  db.run(
    `INSERT INTO documents (title, content, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    [title, content, authorId, now, now],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error.' });
      }

      return res.status(201).json({ message: 'Document created successfully.', documentId: this.lastID });
    }
  );
};

// 문서 하나 보기
const getDocumentById = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT documents.*, users.email AS author_email
          FROM documents
          JOIN users ON documents.author_id = users.id
          WHERE documents.id = ?`, 
    [id],
    (err, document) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error.' });
      }

      if (!document) {
        return res.status(404).json({ error: 'Document not found.' });
      }

      return res.json({ document });
    }
  );
};

// 문서 리스트 보기
const getAllDocuments = (req, res) => {
  db.all(`SELECT documents.id, documents.title, documents.created_at, users.email AS author_email
          FROM documents
          JOIN users ON documents.author_id = users.id
          ORDER BY documents.created_at DESC`, 
    [],
    (err, documents) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error.' });
      }

      return res.json({ documents });
    }
  );
};

const updateDocument = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const now = new Date().toISOString();
  
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
  
    // 먼저 기존 문서 가져오기
    db.get(`SELECT * FROM documents WHERE id = ?`, [id], (err, document) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error.' });
      }
  
      if (!document) {
        return res.status(404).json({ error: 'Document not found.' });
      }
  
      // 기존 내용을 history에 저장
      db.run(
        `INSERT INTO document_history (document_id, title, content) VALUES (?, ?, ?)`,
        [document.id, document.title, document.content],
        function (err) {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error (history).' });
          }
  
          // 문서 업데이트
          db.run(
            `UPDATE documents SET title = ?, content = ?, updated_at = ? WHERE id = ?`,
            [title, content, now, id],
            function (err) {
              if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error (update).' });
              }
  
              return res.json({ message: 'Document updated successfully.' });
            }
          );
        }
      );
    });
  };
  
  const getDocumentHistory = (req, res) => {
    const { id } = req.params;
  
    db.all(`SELECT id, title, content, edited_at
            FROM document_history
            WHERE document_id = ?
            ORDER BY edited_at DESC`,
      [id],
      (err, history) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Database error.' });
        }
  
        return res.json({ history });
      }
    );
  };

  
module.exports = { createDocument, getDocumentById, getAllDocuments, updateDocument, getDocumentHistory };

