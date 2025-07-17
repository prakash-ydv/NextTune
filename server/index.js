import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { channel } from "diagnostics_channel";

dotenv.config();
const origin = process.env.origin;
const api_key = process.env.api_key;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: origin,
  },
});

app.use(cors());

function newRoomCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

let rooms = {};

// WebSocket connection
io.on("connection", (socket) => {
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
          leftTime: 0,
          status: "watching",
          isHost: true,
          isMod: false,
          isLeft: false,
        },
      ],
      videoInfo: {
        isPlaying: false,
        currentVideoId: "",
        startedAt: 0,
        pausedAt: null,
        pausedDuration: 0,
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
            `Your room code is ${code}, invite your friends and enjoy together..`,
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
      leftTime: 0,
      status: "watching",
      isHost: false,
      isMod: false,
      isLeft: false,
    });

    socket.join(String(joinRoomCode));

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
  });

  // add video id to queue
  socket.on("add-video-id-to-queue", (data) => {
    const { vdo, roomCode } = data;

    const room = rooms[roomCode];
    if (!room) return;
    room.videoInfo.queue.push(vdo);
    const updatedQueue = room.videoInfo.queue;
    io.to(String(roomCode)).emit("queue-updated", updatedQueue);
  });

  // remove video from queue
  socket.on("remove-video-from-queue", (data) => {
    const { videoId, roomCode } = data;
    const room = rooms[roomCode];
    if (!room) return;

    // Filter out the videoId from the queue
    room.videoInfo.queue = room.videoInfo.queue.filter(
      (video) => video.id.videoId !== videoId
    );
    const updatedQueue = room.videoInfo.queue;
    io.to(String(roomCode)).emit("queue-updated", updatedQueue);
  });

  // play video from qeueue
  socket.on("play-video-from-queue", (data) => {
    const { videoId, roomCode } = data;
    const room = rooms[roomCode];
    if (!room) return;

    room.videoInfo.currentVideoId = videoId;
    room.videoInfo.startedAt = Date.now();
    room.videoInfo.pausedAt = null;
    room.videoInfo.pausedDuration = 0;

    io.to(String(roomCode)).emit("sync-play-from-queue", {
      currentTime: Date.now() / 1000,
      videoId: room.videoInfo.currentVideoId, // Send current video ID
    });
  });

  // sync play
  socket.on("sync-play-video", (data) => {
    const { roomCode, currentVideoId } = data; // Add videoId to parameters
    const room = rooms[roomCode];
    if (!room) return;

    const videoInfo = room.videoInfo;

    // Handle new video start
    if (currentVideoId && videoInfo.currentVideoId !== currentVideoId) {
      videoInfo.currentVideoId = currentVideoId;
      videoInfo.startedAt = Date.now(); // Set start time when video changes
      videoInfo.pausedDuration = 0;
      videoInfo.pausedAt = null;
    }

    videoInfo.isPlaying = true;

    // Handle resume from pause
    if (videoInfo.pausedAt !== null) {
      videoInfo.pausedDuration += Date.now() - videoInfo.pausedAt;
      videoInfo.pausedAt = null;
    }

    // Calculate current time based on actual start
    const baseTime =
      videoInfo.startedAt > 0
        ? Date.now() - videoInfo.startedAt - videoInfo.pausedDuration
        : 0;

    io.to(String(roomCode)).emit("sync-play-video", {
      startedAt: videoInfo.startedAt,
      currentTime: baseTime / 1000,
      pausedDuration: videoInfo.pausedDuration,
      videoId: videoInfo.currentVideoId, // Send current video ID
    });
  });

  // sync pause
  socket.on("sync-pause-video", (data) => {
    const { roomCode } = data;
    const room = rooms[roomCode];
    if (!room) return;

    const videoInfo = room.videoInfo;
    videoInfo.isPlaying = false;
    videoInfo.pausedAt = Date.now();

    io.to(String(roomCode)).emit("sync-pause-video", {
      pausedAt: videoInfo.pausedAt,
    });
  });

  // handle message
  socket.on("send-message", (data) => {
    const { roomCode, name, message, isAdmin, isMod, time } = data;

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

  // heartbeat effect
  socket.on("heart-beat-effect", (data) => {
    console.log("heart recieved");
    const roomCode = data;
    const room = rooms[roomCode];
    if (!room) return;

    const videoInfo = room.videoInfo;

    if (videoInfo.isPlaying == false) return;
    // Calculate current time based on actual start
    const baseTime =
      videoInfo.startedAt > 0
        ? Date.now() - videoInfo.startedAt - videoInfo.pausedDuration
        : 0;

    io.to(String(roomCode)).emit("sync-play-video", {
      startedAt: videoInfo.startedAt,
      currentTime: baseTime / 1000,
      pausedDuration: videoInfo.pausedDuration,
      videoId: videoInfo.currentVideoId, // Send current video ID
    });
    console.log("heartbeat sent");
  });

  socket.on("disconnect", () => {
    // Loop through all rooms to mark user as left
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const user = room.userInfo.find((u) => u.userId === socket.id);
      if (user && !user.isLeft) {
        user.isLeft = true;
        user.status = "Left";
        user.leftTime = Date.now();
        const updatedUsers = rooms[roomCode].userInfo;
        io.to(String(roomCode)).emit("sync-users", updatedUsers);
      }
    }
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
