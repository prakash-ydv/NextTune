import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const api_key = process.env.api_key;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Set your frontend URL here in production
  },
});

app.use(cors());

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({ status: "running" });
});

// YouTube search route
app.get("/search/:videoTitle", async (req, res) => {
  const videoTitle = req.params.videoTitle;
  if (!videoTitle) return;
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        videoTitle
      )}&key=${api_key}&maxResults=5`
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    res.json(data);
  } catch (error) {
    console.error("YouTube API error:", error.message);
    res.status(500).json({ error: "Failed to fetch YouTube videos" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
