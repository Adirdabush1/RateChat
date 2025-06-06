"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = 'https://ratechat2.onrender.com';
const registerUser = async (email, password) => {
    const response = await axios_1.default.post(`${API_URL}/register`, { email, password });
    return response.data;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const response = await axios_1.default.post(`${API_URL}/login`, { email, password });
    return response.data;
};
exports.loginUser = loginUser;
//# sourceMappingURL=authService.js.map