import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";
import http from "http";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import massageRouter from "./routes/massage.route.js";
import uploadRouter from "./routes/upload.route.js";

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/massage", massageRouter);
app.use("/api/upload", uploadRouter);
app.get("/", (req, res) => { res.send("Backend is running 🚀"); });

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

const onlineUsers = new Map();

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ SETUP USER
    socket.on("setup", (userdata) => {
        const userId = userdata._id;

        socket.userId = userId;

        console.log("Joining user room:", userId);

        // ✅ STORE MULTIPLE SOCKETS
        if (onlineUsers.has(userId)) {
            onlineUsers.get(userId).push(socket.id);
        } else {
            onlineUsers.set(userId, [socket.id]);
        }

    
        socket.join(userId.toString());

        socket.emit("connected");

        io.emit(
            "online users",
            Array.from(onlineUsers.keys())
        );
    });

    socket.on("join chat", (chatId) => {
        socket.join(chatId);
        console.log("Joined chat:", chatId);
    });

    socket.on("leave chat", (chatId) => {
        socket.leave(chatId);
        console.log("Left chat:", chatId);
    });

    socket.on("typing", (chatId) => {
        socket.to(chatId).emit("typing");
    });

    socket.on("stop typing", (chatId) => {
        socket.to(chatId).emit("stop typing");
    });

    socket.on("new message", (message) => {
        const chat = message.chat;

        if (!chat.users) return;

        chat.users.forEach((user) => {
            const userId =
                typeof user === "object"
                    ? user._id
                    : user;

            if (
                userId.toString() ===
                message.sender._id.toString()
            ) {
                return;
            }

            socket
                .to(userId.toString())
                .emit("message received", message);
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (let [userId, sockets] of onlineUsers.entries()) {
            const index = sockets.indexOf(socket.id);

            if (index !== -1) {
                sockets.splice(index, 1);

                if (sockets.length === 0) {
                    onlineUsers.delete(userId);
                }

                break;
            }
        }

        // ✅ UPDATE ONLINE USERS
        io.emit(
            "online users",
            Array.from(onlineUsers.keys())
        );
    });
});

// ✅ DATABASE CONNECTION
connectdb()
    .then(() => {
        const PORT = process.env.PORT || 8000;

        server.listen(PORT, () => {
            console.log(
                `Server listening on port ${PORT}`
            );
        });
    })
    .catch((err) => {
        console.log(`MongoDB connection failed: ${err}`);
    });