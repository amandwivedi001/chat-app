import { useState, useEffect, useRef } from "react";
import { fetchMessage } from "../sevices/messages.api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const ChatBox = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef();
  const socketRef = useRef();

  const { user } = useAuth();

  // ✅ FIND OTHER USER
  const otherUser = selectedChat?.users?.find(
    (u) => u._id !== user._id
  );

  // 🔥 SOCKET CONNECTION
  useEffect(() => {
    socketRef.current = io("http://localhost:8000");

    // ✅ SETUP USER
    socketRef.current.emit("setup", user);

    // ✅ ONLINE USERS
    socketRef.current.on("online users", (users) => {
      setOnlineUsers(users);
    });

    // ✅ TYPING EVENTS
    socketRef.current.on("typing", () => {
      setTyping(true);
    });

    socketRef.current.on("stop typing", () => {
      setTyping(false);
    });

    // ✅ RECEIVE MESSAGE
    socketRef.current.on("message received", (msg) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id);

        if (exists) {
          return prev.map((m) =>
            m._id === msg._id ? msg : m
          );
        }

        return [...prev, msg];
      });
    });

    // ✅ CLEANUP SOCKET EVENTS
    return () => {
      socketRef.current.off("online users");
      socketRef.current.off("typing");
      socketRef.current.off("stop typing");
      socketRef.current.off("message received");

      socketRef.current.disconnect();
    };
  }, []);

  // 🔥 LOAD MESSAGES
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;

      // ✅ LEAVE PREVIOUS ROOM
      socketRef.current.emit("leave chat");

      // ✅ JOIN NEW ROOM
      socketRef.current.emit("join chat", selectedChat._id);

      const res = await fetchMessage(selectedChat._id);

      setMessages(res || []);
    };

    loadMessages();
  }, [selectedChat]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ✅ ONLINE STATUS
  const isUserOnline = () => {
    if (!otherUser) return false;

    return onlineUsers.includes(otherUser._id);
  };

  // ✅ NO CHAT SELECTED
  if (!selectedChat) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <div className="h-15 bg-white border-b flex items-center px-4 shadow-sm">

        <img
          src={
            otherUser?.avatar ||
            "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="ml-3">
          {/* ✅ DYNAMIC USER NAME */}
          <p className="font-semibold text-lg">
            {selectedChat.isGroupChat
              ? selectedChat.chatname
              : otherUser?.Username}
          </p>

          {/* ✅ ONLINE STATUS */}
          <div className="flex items-center gap-2 text-xs">

            <span
              className={`w-2 h-2 rounded-full ${
                isUserOnline()
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            ></span>

            <span>
              {typing
                ? "typing..."
                : isUserOnline()
                ? "online"
                : "offline"}
            </span>

          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">

        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            msg={msg}
          />
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <MessageInput
        selectedChat={selectedChat}
        setMessages={setMessages}
        socketRef={socketRef}
      />
    </div>
  );
};

export default ChatBox;