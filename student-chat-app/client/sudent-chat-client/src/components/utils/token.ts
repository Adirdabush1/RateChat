// קבלת טוקן (למשל לצורך Authorization)
export function getToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('parentToken');
}

// קבלת פרטי המשתמש המחובר
export function getUser(): { name: string; email?: string } | null {
  const userStr = localStorage.getItem('user') || localStorage.getItem('parent');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// הגדרת טוקן חדש
export function setToken(token: string, type: 'parent' | 'user' = 'user'): void {
  if (type === 'parent') {
    localStorage.setItem('parentToken', token);
  } else {
    localStorage.setItem('token', token);
  }
}
