import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://cortexaai-vf4u.onrender.com";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // 💡 BONUS (PRO UX): Auto redirect if already logged in
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ REDIRECT TO DASHBOARD
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '1rem', width: '350px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{isLogin ? "Login" : "Sign Up"}</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <p style={{ color: "#ef4444", fontSize: '0.875rem' }}>{error}</p>}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#334155', color: 'white' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#334155', color: 'white' }}
            required
          />
          
          <button type="submit" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
          
          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </p>
        </form>
      </div>
    </div>
  );
}
