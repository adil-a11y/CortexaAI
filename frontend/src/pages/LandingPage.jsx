import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="nav">
        <h2>Cortexa</h2>
        <div>
          <button className="nav-btn primary" onClick={() => navigate("/chat")}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Cortexa — Your Intelligent AI Assistant</h1>

        <p>
          Think smarter. Respond faster. Unlock powerful AI conversations
          built for productivity and intelligence.
        </p>

        <div className="hero-buttons">
          <button className="primary" onClick={() => navigate("/chat")}>🚀 Get Started Free</button>
          <button className="secondary">Learn More</button>
        </div>
      </section>

      {/* Features */}
      <section className="features">

        <div className="card">
          <h3>⚡ Fast Responses</h3>
          <p>Get instant answers powered by AI.</p>
        </div>

        <div className="card">
          <h3>🧠 Smart Thinking</h3>
          <p>Understands context like a human.</p>
        </div>

        <div className="card">
          <h3>🔐 Secure</h3>
          <p>Your data stays safe and private.</p>
        </div>

      </section>

      {/* Footer */}
      <footer className="footer">
        © 2026 Cortexa. All rights reserved.
      </footer>

    </div>
  );
}
