import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";
import http from "http";


dotenv.config({
    path: './.env'
})


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    },
})


app.use(express.json());
app.use(cookieParser());

import userRouter from "./routes/user.route.js"
import chatRouter from "./routes/chat.route.js"
import massageRouter from "./routes/massage.route.js"
import uploadRouter from "./routes/upload.route.js"
import Massage from "./models/massage.model.js";

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/massage", massageRouter);
app.use("/api/upload", uploadRouter);

connectdb()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server listning on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`MongoDB failed error !!!! ${err}`);
    })


const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("User connected ", socket.id);

    // ✅ SETUP
    socket.on("setup", (userdata) => {
        const userId = userdata._id;

        socket.userId = userId;

        console.log("JOINING USER ROOM 👉", userId);

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

    // ✅ JOIN CHAT
    socket.on("join chat", (chatId) => {
        socket.join(chatId);
    });

    // ✅ TYPING
    socket.on("typing", (chatId) => {
        socket.to(chatId).emit("typing");
    });

    socket.on("stop typing", (chatId) => {
        socket.to(chatId).emit("stop typing");
    });

    // ✅ NEW MESSAGE
    socket.on("new message", (message) => {
        const chat = message.chat;

        if (!chat.users) return;

        chat.users.forEach((user) => {
            const userId =
                typeof user === "object"
                    ? user._id
                    : user;

            // skip sender
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

    // ✅ DISCONNECT
    socket.on("disconnect", () => {
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

        io.emit(
            "online users",
            Array.from(onlineUsers.keys())
        );
    });
});