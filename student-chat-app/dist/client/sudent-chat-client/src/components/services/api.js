"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginParent = exports.loginUser = exports.registerParent = exports.registerUser = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = 'https://ratechat2.onrender.com'; // הכתובת של ה-API ב-Render
// הרשמת משתמש רגיל (לוגין רגיל)
const registerUser = async (email, password) => {
    const response = await axios_1.default.post(`${API_URL}/register`, { email, password });
    return response.data;
};
exports.registerUser = registerUser;
// הרשמת הורה עם שם ודוא"ל של הילד
const registerParent = async (data) => {
    const response = await axios_1.default.post(`${API_URL}/auth/register-parent`, data);
    return response.data;
};
exports.registerParent = registerParent;
// כניסת משתמש (לוגין)
const loginUser = async (email, password) => {
    const response = await axios_1.default.post(`${API_URL}/login`, { email, password });
    return response.data;
};
exports.loginUser = loginUser;
// כניסת הורה (לוגין)
const loginParent = async (email, password) => {
    const response = await axios_1.default.post(`${API_URL}/auth/login-parent`, { email, password });
    return response.data;
};
exports.loginParent = loginParent;
//# sourceMappingURL=api.js.map