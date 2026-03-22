import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import InputBar from "./InputBar";
import { suggestions } from "./suggestions";

const API_BASE = import.meta.env.VITE_API_URL || "https://cortexaai-vf4u.onrender.com";

export default function ChatWindow({ chat, updateMessages }) {
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", text };
    const newMessages = [...chat.messages, userMsg];
    updateMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Stream failed");

      // TRUE STREAMING / Real-time typing from server chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";
      
      // Add a placeholder for the AI response
      const updatedMessagesWithPlaceholder = [...newMessages, { role: "assistant", text: "" }];
      updateMessages(updatedMessagesWithPlaceholder);
      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        streamedText += chunk;
        
        // Update the last message in real-time
        const finalMessages = [...newMessages, { role: "assistant", text: streamedText }];
        updateMessages(finalMessages);
      }

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const regenerate = async () => {
    const lastUser = [...chat.messages].reverse().find(m => m.role === "user");
    if (lastUser) sendMessage(lastUser.text);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, loading]);

  return (
    <div className="main">
      <div className="topbar">Cortexa AI</div>

      <div className="chat-area">
        {chat.messages.length === 0 && (
          <div className="suggestions">
            <h2>How can Cortexa help you?</h2>
            <div className="suggestion-grid">
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  className="suggestion-card"
                  onClick={() => sendMessage(item.prompt)}
                >
                  <h4>{item.title}</h4>
                  <p>{item.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {chat.messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && (
          <div className="row assistant">
            <div className="avatar">AI</div>
            <div className="typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        
        <div ref={bottomRef}></div>
      </div>

      <div className="input-container">
        <InputBar sendMessage={sendMessage} disabled={loading} />
        {chat.messages.length > 0 && (
          <button className="regen-btn" onClick={regenerate} disabled={loading}>
            Regenerate Response
          </button>
        )}
      </div>
    </div>
  );
}
