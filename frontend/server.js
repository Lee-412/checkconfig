import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("notification", "Welcome to WebSocket server!");

    // Gửi thông báo khi có sự kiện khác
    setInterval(() => {
        console.log("hit socket interval");
        socket.emit("notification", "New notification from server!");
    }, 5000); // Gửi thông báo mỗi 5 giây

    socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(8080, () => console.log("Server running on port 8080"));
