const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let users = {};

io.on("connection", (socket) => {
    socket.on("user_join", (data) => {
        users[socket.id] = { name: data.name, photo: data.photo, id: socket.id };
        io.emit("update_users", users);
    });

    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });

    // --- Video Calling Signaling ---
    socket.on("call_user", (data) => {
        io.to(data.userToCall).emit("incoming_call", {
            signal: data.signalData,
            from: data.from,
            name: data.name
        });
    });

    socket.on("answer_call", (data) => {
        io.to(data.to).emit("call_accepted", data.signal);
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("update_users", users);
    });
});

server.listen(process.env.PORT || 3000, () => console.log("Server running..."));
