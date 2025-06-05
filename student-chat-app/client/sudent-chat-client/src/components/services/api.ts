const API_URL = 'https://ratechat2.onrender.com';

export const registerParent = async (data: {
  email: string;
  password: string;
  name: string;
  childEmail: string;
}) => {
  const res = await fetch(`${API_URL}/auth/register-parent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Registration failed');
  return res.json();
};

export const loginParent = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login-parent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Login failed');
  return res.json();
};
