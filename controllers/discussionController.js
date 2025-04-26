const db = require('../models/db');

// 토론 추가
const addDiscussion = (req, res) => {
  const { id } = req.params; // 문서 id
  const { comment } = req.body;
  const userId = req.user.id; // 로그인한 사용자

  if (!comment) {
    return res.status(400).json({ error: 'Comment is required.' });
  }

  db.run(
    `INSERT INTO discussions (document_id, user_id, comment) VALUES (?, ?, ?)`,
    [id, userId, comment],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error.' });
      }

      return res.status(201).json({ message: 'Discussion added successfully.', discussionId: this.lastID });
    }
  );
};

// 토론 리스트 보기
const getDiscussions = (req, res) => {
  const { id } = req.params; // 문서 id

  db.all(
    `SELECT discussions.id, discussions.comment, discussions.created_at, users.email AS author_email
     FROM discussions
     JOIN users ON discussions.user_id = users.id
     WHERE discussions.document_id = ?
     ORDER BY discussions.created_at ASC`,
    [id],
    (err, discussions) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error.' });
      }

      return res.json({ discussions });
    }
  );
};

module.exports = { addDiscussion, getDiscussions };
