import { useState, useEffect, useRef } from "react";
import { sendMassage } from "../sevices/messages.api.jsx";
import uploadFiles  from "../sevices/upload.jsx";

const MessageInput = ({
  selectedChat,
  setMessages,
  socketRef,
}) => {

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const inputRef = useRef();
  const typingTimeoutRef = useRef(null);

  const sendMessage = async () => {

    if (!content && !image) return;

    let imageUrl = "";

    // UPLOAD IMAGE
    if (image) {
      imageUrl = await uploadFiles(image);
    }

    const res = await sendMassage({
      content,
      image: imageUrl,
      chatId: selectedChat._id,
    });

    setMessages((prev) => [...prev, res]);

    socketRef.current.emit("new message", res);

    setContent("");
    setImage(null);
    setPreview("");
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

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, []);

  return (
    <div className="p-3 border-t bg-white">

      {preview && (
        <div className="mb-2 relative w-fit">

          <img
            src={preview}
            className="w-28 h-28 object-cover rounded-lg border"
          />

          <button
            onClick={() => {
              setImage(null);
              setPreview("");
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
          >
            ✕
          </button>

        </div>
      )}

      <div className="flex items-center gap-2">

        <label className="cursor-pointer text-2xl">
          📷

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {

              const file = e.target.files[0];

              if (!file) return;

              setImage(file);

              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>

        <input
          ref={inputRef}
          value={content}
          onChange={(e) => {

            setContent(e.target.value);

            socketRef.current.emit(
              "typing",
              selectedChat._id
            );

            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {

              socketRef.current.emit(
                "stop typing",
                selectedChat._id
              );

            }, 3000);

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
    </div>
  );
};

export default MessageInput;