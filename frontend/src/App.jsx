import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./Auth";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Clean Routing Pattern as requested */}
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        
        {/* Default route (IMPORTANT) */}
        <Route path="*" element={<Auth />} />
      </Routes>
    </Router>
  );
}
