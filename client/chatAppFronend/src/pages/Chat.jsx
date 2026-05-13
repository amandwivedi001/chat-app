import { useState } from "react";
import SideBar from "../components/SideBar";
import ChatBox from "../components/ChatBox";
import Header from "../components/Header";

 const Chat = () => {

   const [selectedChat, setSelectedChat] = useState(null);
    return (
      <div className="h-screen flex flex-col bg-gray-100">

      <Header />

      <div className="flex flex-1 overflow-hidden">

        <div className="w-[30%] bg-white border-r">
          <SideBar setSelectedChat={setSelectedChat} />
        </div>

        <div className="w-[70%]">
          <ChatBox selectedChat={selectedChat} />
        </div>

      </div>
    </div>
    )
 }

 export default Chat;