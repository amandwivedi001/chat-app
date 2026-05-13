import { useAuth } from "../context/AuthContext";
import { accessChat } from "../sevices/chat.api";

const UserList = ({ users, setSelectedChat, setChats }) => {
    const { user } = useAuth();
    const handleUserClick = async (userId) => {
        const chat = await accessChat(userId);
        setSelectedChat(chat);

        setChats(prev => {
            const exists = prev.some(c => c._id === chat._id);
            if (exists) return prev;
            return [chat, ...prev];
        });
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-2 space-y-2 mt-2">

      {users.map((u) => u._id !== user._id && (
        <div
          key={u._id}
          onClick={() => handleUserClick(u._id)}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-green-50 hover:scale-[1.02]"
        >
          <img
            src={u.avatar || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"}
            className="w-10 h-10 rounded-full border"
          />

          <p className="font-medium text-gray-800">
            {u.Username}
          </p>
        </div>
      ))}

    </div>
    )
}

export default UserList;