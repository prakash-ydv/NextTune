import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// 1. Create the context
const RoomContext = createContext();

// 2. Create the provider component
export const RoomContextProvider = ({ children }) => {
  const socket = useRef(null);
  const playerRef = useRef(null);
  const [myName, setMyName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState(null);
  const [chats, setChats] = useState([]);
  const [videos, setVideos] = useState([]); //queue
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("c6oMDHja4gY");
  const [startedAt, setStartedAt] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [joinRoomName, setJoinRoomName] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL);

    // Cleanup function
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  //   handle room created
  useEffect(() => {
    socket.current.on("room-created", (data) => {
      const roomCode = data.roomCode;
      const chats = data.chatInfo;
      const videoInfo = data.videoInfo;
      const users = data.users;
      setRoomCode(roomCode);
      setChats(chats);
      setVideos(videoInfo.queue);
      setUsers(users);
      setIsAdmin(true);
      setIsJoined(true);

      localStorage.setItem("room-code", roomCode);
    });

    return () => {
      localStorage.removeItem("room-code");
      socket.current.off("room-created");
    };
  }, []);

  //   handle room join
  useEffect(() => {
    socket.current.on(
      "user-joined",
      (data) => {
        if (!isJoined) {
          const roomCode = data.roomCode;
          const chats = data.chatInfo;
          const videoInfo = data.videoInfo; //videoInfo
          const users = data.users;
          setRoomCode(roomCode);
          setChats(chats);
          setVideos(videos);
          setUsers(users);
          setMyName(data.myName);
          setIsAdmin(data.isAdmin);
          setIsJoined(true);
          setCurrentVideoId(videoInfo?.currentVideoId);

          if (videos.currentVideoId) {
            setCurrentVideoId(videoInfo.currentVideoId);
            if (videoInfo.isPlaying == true) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          }

          localStorage.setItem("room-code", roomCode);
        }
      },
      []
    );

    return () => {
      localStorage.removeItem("room-code");
      socket.current.off("user-joined");
    };
  }, []);

  // handle play pause state change
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
      playerRef.current.seekTo(currentTime, true);
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // sync user when a user join or left
  useEffect(() => {
    socket.current.on("sync-users", (data) => {
      setUsers(data);
    });
  });

  // handle chat updage
  useEffect(() => {
    socket.current.on("updated-chat", (data) => {
      setChats(data);
    });

    return () => {
      socket.current.off("updated-chat");
    };
  }, []);

  // update Queue
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("queue-updated", (data) => {
      if (data) {
        setVideos([...data].reverse());
      }
    });

    return () => {
      socket.current.off("queue-updated");
    };
  }, [socket.current]);

  // handle play from queue
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("sync-play-from-queue", (data) => {
      const { currentTime, videoId } = data;
      setCurrentTime(currentTime);
      setCurrentVideoId(videoId);
    });

    return () => {
      socket.current.off("sync-play-from-queue");
    };
  }, []);

  // sync play video
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("sync-play-video", (data) => {
      const { startedAt, currentTime } = data;
      setIsPlaying(true);
      setStartedAt(startedAt);
      setCurrentTime(currentTime);
    });
  }, []);

  // sync pause video
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("sync-pause-video", () => {
      setIsPlaying(false);
    });
  }, []);

  // send heartbeat effect -- admin side
  useEffect(() => {
    if (!socket.current || !isAdmin) return;
    let heartbeatInterval = setInterval(() => {
      socket.current.emit("heart-beat-effect", roomCode);
    }, 5000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [socket.current, isAdmin, roomCode]);

  //   create room function
  function createRoom(e) {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit("create-room", { name: myName, roomName });
    }
  }

  //   join room
  function joinRoom(e) {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit("join-room", { joinRoomName, joinRoomCode });
    }
    setJoinRoomCode("");
    setJoinRoomName("");
  }

  // add video id to queue
  function addVideoToQueue(vdo) {
    if (!socket.current) return;
    socket.current?.emit("add-video-id-to-queue", {
      vdo,
      roomCode,
    });
  }

  // sync play
  function syncPlayVideo(id) {
    if (!isAdmin && !isMod) return;
    socket.current.emit("sync-play-video", { roomCode, currentVideoId });
  }

  function syncPauseVideo() {
    if (!isAdmin && !isMod) return;
    socket.current.emit("sync-pause-video", { roomCode });
  }

  function togglePlayPause() {
    if (!playerRef.current || !isAdmin) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      syncPauseVideo();
    } else {
      playerRef.current.playVideo();
      syncPlayVideo();
    }
  }
  return (
    <RoomContext.Provider
      value={{
        createRoom,
        joinRoom,
        joinRoomName,
        joinRoomCode,
        setJoinRoomName,
        setJoinRoomCode,
        myName,
        setMyName,
        roomName,
        setRoomName,
        roomCode,
        socket: socket.current,
        users,
        videos,
        chats,
        isAdmin,
        isMod,
        addVideoToQueue,
        playerRef,
        syncPlayVideo,
        syncPauseVideo,
        isPlaying,
        togglePlayPause,
        currentVideoId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
