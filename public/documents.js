const API_URL = 'http://localhost:3000/api';

const documentListDiv = document.getElementById('documentList');
const createBtn = document.getElementById('createBtn');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect'); // ✅ 추가

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/index.html';
}

let allDocuments = []; // 전체 문서 저장
let filteredDocuments = []; // 필터된 문서 저장

// 문서 리스트 가져오기
async function fetchDocuments() {
  try {
    const res = await fetch(`${API_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      allDocuments = data.documents;
      filteredDocuments = allDocuments; // 초기값
      renderDocuments(filteredDocuments);
    } else {
      alert('Failed to fetch documents.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching documents.');
  }
}

// 문서 리스트 렌더링
function renderDocuments(documents) {
  documentListDiv.innerHTML = '';

  if (documents.length === 0) {
    documentListDiv.innerHTML = '<p class="text-gray-500 text-center">No documents found.</p>';
    return;
  }

  documents.forEach(doc => {
    const docItem = document.createElement('div');
    docItem.className = 'p-4 border rounded shadow hover:bg-gray-50 cursor-pointer';
    docItem.innerHTML = `
      <h3 class="text-xl font-semibold">${doc.title}</h3>
      <p class="text-gray-600 text-sm">Author: ${doc.author_email} | Created at: ${new Date(doc.created_at).toLocaleString()}</p>
    `;
    docItem.onclick = () => {
      window.location.href = `/document.html?id=${doc.id}`;
    };
    documentListDiv.appendChild(docItem);
  });
}

// 검색 기능
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  filteredDocuments = allDocuments.filter(doc => 
    doc.title.toLowerCase().includes(query)
  );
  applySort(); // ✅ 검색할 때도 현재 정렬 반영
});

// 정렬 기능
sortSelect.addEventListener('change', () => {
  applySort();
});

// 정렬 적용 함수
function applySort() {
  const sortBy = sortSelect.value;

  let docsToSort = [...filteredDocuments]; // 복사본 만들어서 정렬

  if (sortBy === 'latest') {
    docsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 최신순
  } else if (sortBy === 'title') {
    docsToSort.sort((a, b) => a.title.localeCompare(b.title)); // 제목 A-Z
  }

  renderDocuments(docsToSort);
}

// 새 문서 작성
createBtn.addEventListener('click', () => {
  window.location.href = '/create.html';
});

// 로그아웃
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/index.html';
});

// 시작
fetchDocuments();

