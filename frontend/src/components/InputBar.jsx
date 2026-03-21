import { useState, useEffect, useRef } from "react";

export default function InputBar({ sendMessage, disabled }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // ⚡ AUTO-FOCUS INPUT
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      sendMessage(text);
      setText("");
    }
  };

  return (
    <div className="input-bar">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask anything"
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button onClick={handleSend} disabled={disabled || !text.trim()}>
        ➤
      </button>
    </div>
  );
}
