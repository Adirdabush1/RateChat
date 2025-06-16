import axios from 'axios';

const API_URL = 'https://ratechat-front-d89b15939b57.herokuapp.com'; 

export const registerUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};
export interface LoginResponse {
  access_token: string;
  name:string;
}


export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return response.data;
};
