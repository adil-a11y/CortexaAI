import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import "../App.css";

export default function ChatPage() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [{ id: 1, title: "New Chat", messages: [] }];
  });
  
  const [activeChatId, setActiveChatId] = useState(() => {
    return chats[0]?.id || 1;
  });

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const updateMessages = (messages) => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        let newTitle = chat.title;
        if (messages.length === 1 && messages[0].role === "user") {
          newTitle = messages[0].text.substring(0, 20) + (messages[0].text.length > 20 ? "..." : "");
        }
        return { ...chat, messages, title: newTitle };
      }
      return chat;
    }));
  };

  return (
    <div className="app chat-page-container">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
      />

      {activeChat && (
        <ChatWindow
          chat={activeChat}
          updateMessages={updateMessages}
        />
      )}
    </div>
  );
}
