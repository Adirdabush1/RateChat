import axios from 'axios';

const API_URL = 'https://ratechat2.onrender.com'; // הכתובת של ה-API ב-Render

// הרשמת משתמש רגיל (לוגין רגיל)
export const registerUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};

// הרשמת הורה עם שם ודוא"ל של הילד
export const registerParent = async (data: {
  email: string;
  password: string;
  name: string;
  childEmail: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/register-parent`, data);
  return response.data;
};

export interface LoginResponse {
  access_token: string;
  name: string;
}

// כניסת משתמש (לוגין)
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return response.data;
};

// כניסת הורה (לוגין)
export const loginParent = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login-parent`, { email, password });
  return response.data;
};
