import { useAuth } from "../context/AuthContext";

const ChatList = ({ chats, setSelectedChat }) => {
    const { user } = useAuth();

    const getChatName = (chat) => {
        if (chat.isGroupChat) return chat.chatname;

        return chat.users.find(u => u._id !== user._id)?.Username;
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-2 space-y-2">

      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:scale-[1.02]"
        >
          {/* AVATAR */}
          <img
            src={
              chat.isGroupChat
                ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                : chat.users.find((u) => u._id !== user._id)?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
            }
            className="w-10 h-10 rounded-full border"
          />

          {/* TEXT */}
          <div>
            <p className="font-semibold text-gray-800">
              {getChatName(chat)}
            </p>
            <p className="text-sm text-gray-500 truncate w-37.5">
              {chat.lastMessage?.content || "No messages yet"}
            </p>
          </div>
        </div>
      ))}

    </div>
    )
}

export default ChatList;