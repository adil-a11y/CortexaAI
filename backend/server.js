import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import stripeRoutes from "./routes/stripe.js";
import User from "./models/User.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection (Placeholder - Connect your actual DB here)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cortexa";
mongoose.set('bufferCommands', false); // Fail fast if no DB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL = "meta-llama/Llama-2-7b-chat-hf"; // Using a model that supports streaming better

// Auth Routes
app.use("/auth", authRoutes);
app.use("/stripe", stripeRoutes);

// ✅ ADD HERE
app.get("/ping", (req, res) => {
  res.json({ message: "Backend is online!" });
});

// Get User Profile
app.get("/me", authMiddleware, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Find user from memory
      import("./routes/auth.js").then(({ mockUsers }) => {
        const user = mockUsers.find(u => u._id === req.user.id);
        if (user) return res.json(user);
        res.status(404).json({ error: "Mock user not found" });
      });
      return;
    }
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Profile fetch failed" });
  }
});


// Chat Endpoint with TRUE STREAMING
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const response = await fetch(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-1B-Instruct", // Confirmed working on the new router
          messages: [
            { role: "system", content: "You are Cortexa, a helpful and intelligent AI assistant." },
            { role: "user", content: userMessage }
          ],
          max_tokens: 500,
          stream: true // Enable streaming from HF
        }),
      }
    );

    if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).end(error);
    }

    // Stream the response to the client
    const reader = response.body;
    reader.on('data', (chunk) => {
      const text = chunk.toString();
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '');
          if (jsonStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(jsonStr);
            const content = data.choices[0]?.delta?.content || "";
            if (content) res.write(content);
          } catch (e) {
            // Partial JSON chunk, ignore or buffer
          }
        }
      }
    });

    reader.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error(error);
    res.status(500).end("Server error");
  }
});

const PORT = process.env.PORT || 5000;

// Fallback 404 handler for debugging
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
