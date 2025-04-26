const API_URL = 'http://localhost:3000/api'; // 서버 주소

const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const backBtn = document.getElementById('backBtn');
const createDocBtn = document.getElementById('createDocBtn');
const messageDiv = document.getElementById('message');

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/index.html';
}

// 문서 작성 요청
createDocBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    messageDiv.textContent = 'Title and content are required.';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();
    if (res.ok) {
      // 문서 작성 성공 ➔ 문서 리스트로 이동
      window.location.href = '/documents.html';
    } else {
      messageDiv.textContent = data.error || 'Failed to create document.';
    }
  } catch (error) {
    console.error(error);
    messageDiv.textContent = 'Error creating document.';
  }
});

// 뒤로가기 버튼
backBtn.addEventListener('click', () => {
  window.location.href = '/documents.html';
});
