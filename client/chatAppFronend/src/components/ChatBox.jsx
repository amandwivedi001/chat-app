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

  const otherUser = selectedChat?.users?.find(
    (u) =>
      u._id.toString() !==
      user._id.toString()
  );
  console.log("CHATBOX RENDERED");
  console.log("USER:", user);
  useEffect(() => {
    console.log("SOCKET EFFECT RUNNING");
    if (!user) {
      console.log("USER NOT FOUND");
    }
    if (!user) return;

    socketRef.current = io(
      import.meta.env.VITE_API_URL,
      {
        withCredentials: true,
      }
    );

    socketRef.current.on("connect", () => {

      console.log(
        "SOCKET CONNECTED:",
        socketRef.current.id
      );

      socketRef.current.emit(
        "setup",
        user
      );
    });

    socketRef.current.on(
      "online users",
      (users) => {

        console.log(
          "ONLINE USERS:",
          users
        );

        setOnlineUsers(users);
      }
    );

    socketRef.current.on(
      "typing",
      () => {
        setTyping(true);
      }
    );

    socketRef.current.on(
      "stop typing",
      () => {
        setTyping(false);
      }
    );

    socketRef.current.on(
      "message received",
      (msg) => {

        setMessages((prev) => {

          const exists = prev.find(
            (m) => m._id === msg._id
          );

          if (exists) return prev;

          return [...prev, msg];
        });
      }
    );

    return () => {

      socketRef.current.disconnect();
    };

  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;

      socketRef.current.emit("leave chat");

      socketRef.current.emit("join chat", selectedChat._id);

      const res = await fetchMessage(selectedChat._id);

      setMessages(res || []);
    };

    loadMessages();
  }, [selectedChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const isUserOnline = () => {
    if (!otherUser) return false;

    return onlineUsers.includes(
      otherUser._id.toString()
    );
  };

  if (!selectedChat) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

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
          <p className="font-semibold text-lg">
            {selectedChat.isGroupChat
              ? selectedChat.chatname
              : otherUser?.Username}
          </p>

          <div className="flex items-center gap-2 text-xs">

            <span
              className={`w-2 h-2 rounded-full ${isUserOnline()
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

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">

        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            msg={msg}
          />
        ))}

        <div ref={bottomRef}></div>
      </div>

      <MessageInput
        selectedChat={selectedChat}
        setMessages={setMessages}
        socketRef={socketRef}
      />
    </div>
  );
};

export default ChatBox;