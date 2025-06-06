"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocket = exports.disconnectSocket = exports.connectSocket = void 0;
const socket_io_client_1 = require("socket.io-client");
let socket = null;
const connectSocket = (token, CHAT_ID) => {
    console.log('Connecting socket with:', { token, CHAT_ID });
    socket = (0, socket_io_client_1.io)('http://localhost:3000', {
        auth: {
            token,
            CHAT_ID,
        },
    });
    return socket;
};
exports.connectSocket = connectSocket;
const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
exports.disconnectSocket = disconnectSocket;
const getSocket = () => socket;
exports.getSocket = getSocket;
//# sourceMappingURL=socket.js.map