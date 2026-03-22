import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://cortexaai-vf4u.onrender.com";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/auth");
        return;
    }

    fetch(`${API_BASE}/me`, {
      headers: { Authorization: token },
    })
      .then(res => {
        if (!res.ok) throw new Error("Auth failed");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/auth");
      });
  }, [navigate]);

  if (loading) return <div className="loading">Checking your session...</div>;

  return (
    <div className="dashboard landing">
      <nav className="nav">
        <h2>Cortexa Dashboard</h2>
        <button className="nav-btn" onClick={() => navigate("/chat")}>Back to Chat</button>
      </nav>

      <div className="hero">
        <h1>Welcome Back!</h1>
        <div className="card" style={{ width: "400px", margin: "auto" }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Plan:</strong> {user?.plan}</p>
          <p><strong>User ID:</strong> {user?._id}</p>
          
          {user?.plan === "free" && (
            <button className="nav-btn primary" style={{ marginTop: "20px" }}>
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
