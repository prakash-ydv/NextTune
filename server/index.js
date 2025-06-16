import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { channel } from "diagnostics_channel";

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
          status: "watching",
          isHost: true,
          isMod: false,
        },
      ],
      videoInfo: {
        isPlaying: false,
        currentVideoId: "",
        startedAt: "",
        queue: [],
      },
      chatInfo: [
        {
          name: "NextTune",
          message:
            "Welcome to the room, Invite and enjoy with your loved ones !",
          time: Date.now(),
          isAdmin: false,
          isMod: true,
        },
        {
          name: "NextTune",
          message:
            "You can also chat with you friends :-), Just start typing..",
          time: Date.now(),
          isAdmin: false,
          isMod: true,
        },
        {
          name: "NextTune",
          message: "Ok ! Bye...👋",
          time: Date.now(),
          isAdmin: false,
          isMod: true,
        },
      ],
    };

    socket.join(String(code));
    console.log("room created - ", code);

    const infos = {
      roomCode: code,
      chatInfo: rooms[code].chatInfo,
      videoInfo: rooms[code].videoInfo,
      users: rooms[code].userInfo,
    };

    socket.emit("room-created", infos);
  });

  // join room
  socket.on("join-room", (data) => {
    const { joinRoomName, joinRoomCode } = data;
    const room = rooms[joinRoomCode];

    if (!room) {
      socket.emit("room-not-found");
      return;
    }
    room.userInfo.push({
      name: joinRoomName,
      userId: socket.id,
      joinedTime: Date.now(),
      status: "watching",
      isHost: false,
      isMod: false,
    });

    socket.join(String(joinRoomCode));
    console.log("Room Joined", joinRoomCode);

    const infos = {
      roomCode: joinRoomCode,
      chatInfo: rooms[joinRoomCode].chatInfo,
      videoInfo: rooms[joinRoomCode].videoInfo,
      users: rooms[joinRoomCode].userInfo,
      isAdmin: false,
      myName: joinRoomName,
    };

    const updatedUsers = rooms[joinRoomCode].userInfo;

    socket.emit("user-joined", infos);
    io.to(String(joinRoomCode)).emit("sync-users", updatedUsers);
    const updatedQueue = room.videoInfo.queue;
    io.to(String(joinRoomCode)).emit("queue-updated", updatedQueue);
    console.log("new user joined");
  });

  // add video id to queue

  socket.on("add-video-id-to-queue", (data) => {
    const { vdo, roomCode } = data;

    const room = rooms[roomCode];
    if (!room) return;
    room.videoInfo.queue.push(vdo);
    const updatedQueue = room.videoInfo.queue;
    io.to(String(roomCode)).emit("queue-updated", updatedQueue);
    console.log("Updated Queue Sent", updatedQueue);
  });

  // sync play
  socket.on("sync-play-video", (data) => {
    const { roomCode } = data;
    const room = rooms[roomCode];
    if (!room) return;

    room.videoInfo.isPlaying = true;
    io.to(String(roomCode)).emit("sync-play-video");
  });

  // sync pause
  socket.on("sync-pause-video", (data) => {
    const { roomCode } = data;
    const room = rooms[roomCode];
    if (!room) return;

    room.videoInfo.isPlaying = false;
    io.to(String(roomCode)).emit("sync-pause-video");
  });

  // handle message
  socket.on("send-message", (data) => {
    const { roomCode, name, message, isAdmin, isMod, time } = data;
    console.log("message sent to room", roomCode);

    const room = rooms[roomCode];
    room.chatInfo.push({
      isAdmin,
      isMod,
      message,
      name,
      time,
    });

    io.to(String(roomCode)).emit("updated-chat", room.chatInfo);
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
      )}&key=${api_key}&maxResults=4`
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    res.json(data.items.slice(0, 4)); //send only 4 video data
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
