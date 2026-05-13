import { useState, useEffect, useRef } from "react";
import { sendMassage } from "../sevices/messages.api";

const MessageInput = ({ selectedChat, setMessages, socketRef }) => {
  const [content, setContent] = useState("");
  const inputRef = useRef();
  const typingTimeoutRef = useRef(null);

  const sendMessage = async () => {
    if (!content) return;

    const res = await sendMassage({
      content,
      chatId: selectedChat._id,
    });

    setMessages((prev) => [...prev, res]);

    socketRef.current.emit("new message", res);

    setContent("");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === inputRef.current) return;
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="p-3 border-t bg-white flex items-center gap-2">

      <input
        ref={inputRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);

          socketRef.current.emit("typing", selectedChat._id);

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("stop typing", selectedChat._id);
          }, 5000);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
        className="flex-1 px-4 py-2 rounded-full border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type a message..."
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
      >
        ➤
      </button>

    </div>
  );
};

export default MessageInput;