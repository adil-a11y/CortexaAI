export default function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat
}) {
  return (
    <div className="sidebar">
      <div className="logo">Cortexa AI</div>
      <button className="new-chat" onClick={createNewChat}>
        + New Chat
      </button>

      <div className="chat-history">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
            onClick={() => setActiveChatId(chat.id)}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}
