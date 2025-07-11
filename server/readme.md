# 🎵 NextTune Backend

This is the backend for **NextTune**, a real-time collaborative video watching platform. Built with **Node.js**, **Express**, and **Socket.IO**, it allows users to create or join rooms, sync video playback, manage queues, and chat in real-time.

---

## 🚀 Features

- 🔐 Create and join rooms with 6-digit codes
- 👥 Track active users in each room
- 📺 Add/remove YouTube videos in a shared queue
- ⏯️ Synchronized play/pause across all users
- 💬 Real-time group chat
- 🔎 Search YouTube videos via REST API
- ❤️ Heartbeat mechanism to keep video playback in sync

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Socket.IO
- YouTube Data API v3
- dotenv
- node-fetch
- CORS

---


### 🔌 WebSocket Events
#### Client -> Server

| Event                     | Payload                                             | Description                      |
| ------------------------- | --------------------------------------------------- | -------------------------------- |
| `create-room`             | `{ name, roomName }`                                | Creates a new room               |
| `join-room`               | `{ joinRoomName, joinRoomCode }`                    | Joins a room                     |
| `add-video-id-to-queue`   | `{ vdo, roomCode }`                                 | Adds a video to the queue        |
| `remove-video-from-queue` | `{ videoId, roomCode }`                             | Removes video from queue         |
| `play-video-from-queue`   | `{ videoId, roomCode }`                             | Starts video from queue          |
| `sync-play-video`         | `{ roomCode, currentVideoId }`                      | Syncs play across users          |
| `sync-pause-video`        | `{ roomCode }`                                      | Pauses video for all users       |
| `send-message`            | `{ roomCode, name, message, isAdmin, isMod, time }` | Sends chat message               |
| `heart-beat-effect`       | `roomCode`                                          | Heartbeat to maintain video sync |


### Server -> Client

| Event                  | Description                              |
| ---------------------- | ---------------------------------------- |
| `room-created`         | Emits room info to creator               |
| `user-joined`          | Emits room info to joining user          |
| `sync-users`           | Sends updated user list to room          |
| `queue-updated`        | Sends updated video queue                |
| `sync-play-from-queue` | Syncs play state when started from queue |
| `sync-play-video`      | Broadcasts current play state            |
| `sync-pause-video`     | Broadcasts current pause state           |
| `updated-chat`         | Sends updated chat to room               |
| `room-not-found`       | Sent if join-room fails                  |


## 🔍 API Routes

```
GET /search/:videoTitle
Searches YouTube for videos based on a title.
```

Example:

```
[
  {
    "id": { "videoId": "abc123" },
    "snippet": { "title": "Lofi Chill", ... }
  },
  ...
]

```

## 📁 Project Structure

```

├── index.js          # Main backend file
├── .env               # API keys and config
├── package.json
└── readme.md
