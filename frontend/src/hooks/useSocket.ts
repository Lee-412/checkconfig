import { io } from "socket.io-client";
import { SOCKET_URL } from '../utils/constants'

export const socket = io(SOCKET_URL, { autoConnect: false });

socket.on("connect", () => console.log("Connected to WebSocket server"));
socket.on("disconnect", () => console.log("Disconnected from WebSocket server"));