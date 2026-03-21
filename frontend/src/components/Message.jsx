import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Message({ msg }) {
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(msg.text);

  return (
    <div className={`row ${msg.role}`}>
      <div className="avatar">
        {msg.role === "user" ? "U" : "AI"}
      </div>

      <div className="message-box">
        {editing ? (
          <div className="edit-box">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              autoFocus
            />
            <div className="edit-actions">
              <button onClick={() => setEditing(false)}>Cancel</button>
              <button onClick={() => setEditing(false)}>Save</button>
            </div>
          </div>
        ) : (
          <div className="text" style={{ paddingRight: "40px" }}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        )}

        <div className="actions">
          <button onClick={() => navigator.clipboard.writeText(msg.text)} title="Copy">
            Copy
          </button>
          {msg.role === "user" && (
            <button onClick={() => setEditing(true)} title="Edit">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
