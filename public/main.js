const API_URL = 'http://localhost:3000/api'; // 백엔드 서버 주소

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

signupBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      messageDiv.textContent = 'Sign up successful! Please log in.';
      messageDiv.className = 'text-green-500 mt-4';
    } else {
      messageDiv.textContent = data.error || 'Sign up failed.';
      messageDiv.className = 'text-red-500 mt-4';
    }
  } catch (error) {
    console.error(error);
    messageDiv.textContent = 'Sign up error.';
  }
});

loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
  
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        messageDiv.textContent = 'Login successful!';
        messageDiv.className = 'text-green-500 mt-4';
  
        // ✅ 로그인 성공하면 문서 리스트 페이지로 이동
        window.location.href = '/documents.html';
      } else {
        messageDiv.textContent = data.error || 'Login failed.';
        messageDiv.className = 'text-red-500 mt-4';
      }
    } catch (error) {
      console.error(error);
      messageDiv.textContent = 'Login error.';
    }
  });
  