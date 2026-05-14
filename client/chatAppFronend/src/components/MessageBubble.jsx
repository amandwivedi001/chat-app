import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ImagePreview from "./ImagePreview";

const MessageBubble = ({ msg }) => {

  const { user } = useAuth();

  const [showPreview, setShowPreview] = useState(false);

  const isMe =
    msg.sender?._id?.toString() === user?._id?.toString();

  return (
    <>
      <div
        className={`flex ${
          isMe ? "justify-end" : "justify-start"
        } mb-3`}
      >

        <div
          className={`px-3 py-2 rounded-2xl max-w-[65%] text-sm shadow-sm
          ${
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none border"
          }`}
        >

          {/* IMAGE */}
          {msg.image && (
            <img
              src={msg.image}
              alt="sent"
              onClick={() => setShowPreview(true)}
              className="rounded-xl mb-2 max-w-62.5 cursor-pointer hover:opacity-90 transition"
            />
          )}

          {/* TEXT */}
          {msg.content && (
            <p>{msg.content}</p>
          )}

          {/* TIME */}
          <div className="flex justify-end mt-1">
            <p
              className={`text-[10px] ${
                isMe
                  ? "text-blue-100"
                  : "text-gray-400"
              }`}
            >
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {showPreview && (
        <ImagePreview
          image={msg.image}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default MessageBubble;