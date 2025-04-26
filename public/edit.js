const API_URL = 'http://localhost:3000/api'; // 서버 주소

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');

const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const messageDiv = document.getElementById('message');

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/index.html';
}

// 기존 문서 데이터 불러오기
async function fetchDocument() {
  try {
    const res = await fetch(`${API_URL}/documents/${documentId}`);
    const data = await res.json();
    if (res.ok) {
      const doc = data.document;
      titleInput.value = doc.title;
      contentInput.value = doc.content;
    } else {
      alert('Failed to fetch document.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching document.');
  }
}

// 문서 수정 요청
saveBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    messageDiv.textContent = 'Title and content are required.';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/documents/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    if (res.ok) {
      window.location.href = `/document.html?id=${documentId}`;
    } else {
      const data = await res.json();
      messageDiv.textContent = data.error || 'Failed to update document.';
    }
  } catch (error) {
    console.error(error);
    messageDiv.textContent = 'Error updating document.';
  }
});

// 뒤로가기 버튼
backBtn.addEventListener('click', () => {
  window.location.href = `/document.html?id=${documentId}`;
});

// 시작
fetchDocument();
