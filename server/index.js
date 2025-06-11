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

function newRoomCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

let rooms = {};

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  // create room
  socket.on("create-room", (data) => {
    const { name, roomName } = data;
    const code = newRoomCode();

    rooms[code] = {
      roomInfo: {
        roomName: roomName,
        roomCode: code,
        roomPass: "",
        adminId: socket.id,
        mods: [],
        createdTime: Date.now(),
      },
      userInfo: [
        {
          name: name,
          userId: socket.id,
          joinedTime: Date.now(),
          role: "admin",
        },
      ],
      videoInfo: {
        currentVideoId: "",
        startedAt: "",
        queue: [{}],
      },
      chatInfo: [
        {
          name: "NextTune",
          message: "Welcome to the room !",
          time: Date.now(),
          role: "bot",
        },
      ],
    };

    socket.join(code);

    const infos = {
      roomCode: code,
      chatInfo: rooms[code].chatInfo,
      videos: rooms[code].videoInfo,
      users: rooms[code].userInfo,
    };

    socket.emit("room-created", infos);

    console.log("Room Created", infos);
  });

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
