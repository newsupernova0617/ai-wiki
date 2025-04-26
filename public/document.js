const API_URL = 'http://localhost:3000/api'; // 서버 주소

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');

const docTitle = document.getElementById('docTitle');
const docContent = document.getElementById('docContent');
const metaInfo = document.getElementById('metaInfo');
const backBtn = document.getElementById('backBtn');
const editBtn = document.getElementById('editBtn');

const discussionList = document.getElementById('discussionList');
const commentInput = document.getElementById('commentInput');
const addCommentBtn = document.getElementById('addCommentBtn');
const historyBtn = document.getElementById('historyBtn');
const discussionSection = document.getElementById('discussionSection');

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/index.html';
}

// 문서 불러오기
async function fetchDocument() {
  try {
    const res = await fetch(`${API_URL}/documents/${documentId}`);
    const data = await res.json();
    if (res.ok) {
      const doc = data.document;
      docTitle.textContent = doc.title;
      docContent.textContent = doc.content;
      metaInfo.textContent = `Author: ${doc.author_email} | Created: ${new Date(doc.created_at).toLocaleString()}`;
    } else {
      alert('Failed to fetch document.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching document.');
  }
}

// 토론 불러오기
async function fetchDiscussions() {
  try {
    const res = await fetch(`${API_URL}/documents/${documentId}/discussions`);
    const data = await res.json();
    if (res.ok) {
      renderDiscussions(data.discussions);
    } else {
      alert('Failed to fetch discussions.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching discussions.');
  }
}

function renderDiscussions(discussions) {
  discussionList.innerHTML = '';
  if (discussions.length === 0) {
    discussionList.innerHTML = '<p class="text-gray-500 text-center">No discussions yet.</p>';
    return;
  }

  discussions.forEach(disc => {
    const div = document.createElement('div');
    div.className = 'p-3 border rounded shadow';
    div.innerHTML = `
      <p class="text-gray-700">${disc.comment}</p>
      <p class="text-gray-500 text-xs text-right">By ${disc.author_email} | ${new Date(disc.created_at).toLocaleString()}</p>
    `;
    discussionList.appendChild(div);
  });
}

// 토론 추가
addCommentBtn.addEventListener('click', async () => {
  const comment = commentInput.value.trim();
  if (!comment) {
    alert('Please enter a comment.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/documents/${documentId}/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ comment })
    });

    if (res.ok) {
      commentInput.value = '';
      fetchDiscussions(); // 다시 불러오기
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to add comment.');
    }
  } catch (error) {
    console.error(error);
    alert('Error adding comment.');
  }
});

// 뒤로가기
backBtn.addEventListener('click', () => {
  window.location.href = '/documents.html';
});

// 문서 수정 (TODO: 나중에 연결)
editBtn.addEventListener('click', () => {
    window.location.href = `/edit.html?id=${documentId}`; // ✅ 수정
  });
  
// 수정 기록 보기
historyBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`${API_URL}/documents/${documentId}/history`);
      const data = await res.json();
      if (res.ok) {
        renderHistory(data.history);
      } else {
        alert('Failed to fetch document history.');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching document history.');
    }
  });
  
  // 수정 기록 렌더링
  function renderHistory(historyList) {
    discussionSection.innerHTML = ''; // 기존 토론 영역 비우기
  
    const title = document.createElement('h3');
    title.className = 'text-2xl font-bold mb-4';
    title.textContent = 'Edit History';
    discussionSection.appendChild(title);
  
    if (historyList.length === 0) {
      const noHistory = document.createElement('p');
      noHistory.className = 'text-gray-500 text-center';
      noHistory.textContent = 'No edit history available.';
      discussionSection.appendChild(noHistory);
      return;
    }
  
    historyList.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'p-4 border rounded shadow mb-4 bg-gray-50';
      div.innerHTML = `
        <h4 class="font-semibold">${entry.title}</h4>
        <p class="text-gray-700 mb-2">${entry.content}</p>
        <p class="text-gray-500 text-sm text-right">Edited at: ${new Date(entry.edited_at).toLocaleString()}</p>
      `;
      discussionSection.appendChild(div);
    });
  }
  
// 시작
fetchDocument();
fetchDiscussions();
