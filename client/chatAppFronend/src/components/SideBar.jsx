import { useState, useEffect } from "react";
import { fetchChat } from "../sevices/chat.api";
import ChatList from "./ChatList";
import UserList from "./UserList";
import { getAllUsers } from "../sevices/authService";

const SideBar = ({ setSelectedChat }) => {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("chats");

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const res = await fetchChat();
                console.log("CHAT DATA:", res);
                setChats(res || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadMessages();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        }
        loadUsers();
    }, [])

    return (
        <div className="p-4 overflow-y-auto h-full">

            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab("chats")}
                    className={`flex-1 py-2 ${activeTab === "chats" ? "border-b-2 border-blue-500" : ""
                        }`}
                >
                    Chats
                </button>

                <button
                    onClick={() => setActiveTab("users")}
                    className={`flex-1 py-2 ${activeTab === "users" ? "border-b-2 border-blue-500" : ""
                        }`}
                >
                    Users
                </button>
            </div>

            {activeTab === "chats" &&
                <ChatList
                    chats={chats}
                    setSelectedChat={setSelectedChat}
                />
            }

            {/* Users */}
            {activeTab === "users" &&

                <UserList
                    users={users}
                    setSelectedChat={setSelectedChat}
                    setChats={setChats}
                />}

        </div>
    );
};

export default SideBar;