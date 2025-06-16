import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";

// 1. Create the context
const RoomContext = createContext();

// 2. Create the provider component
export const RoomContextProvider = ({ children }) => {
  const socket = useRef(null);
  const playerRef = useRef(null);
  const [myName, setMyName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [chats, setChats] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [joinRoomName, setJoinRoomName] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io("http://localhost:3000");

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
      console.log(chats);
      const videos = data.videos;
      const users = data.users;
      setRoomCode(roomCode);
      setChats(chats);
      setVideos(videos);
      setUsers(users);
      setIsAdmin(true);
      setIsJoined(true);

      localStorage.setItem("room-code", roomCode);
      console.log("Room Created with code", roomCode);
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
          const videos = data.videos;
          const users = data.users;
          setRoomCode(roomCode);
          setChats(chats);
          setVideos(videos);
          setUsers(users);
          setMyName(data.myName);
          setIsAdmin(data.isAdmin);
          setIsJoined(true);

          localStorage.setItem("room-code", roomCode);
          console.log("Room Joined with code", roomCode);
        }
      },
      []
    );

    return () => {
      localStorage.removeItem("room-code");
      socket.current.off("user-joined");
    };
  }, []);

  // sync user when a user join or left
  useEffect(() => {
    socket.current.on("sync-users", (data) => {
      setUsers(data);
    });
  });

  // handle chat updage
  useEffect(() => {
    socket.current.on("updated-chat", (data) => {
      console.log("chat update recieved");
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
      console.log("queue-updated");
      console.log(data);
      if (data) {
        setVideos([...data]);
      }
    });

    return () => {
      socket.current.off("queue-updated");
    };
  }, [socket.current]);

  // sync play video
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("sync-play-video", () => {
      playerRef.current.playVideo();
      setIsPlaying(true);
      console.log("Playing...");
    });
  }, []);

  // sync pause video
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("sync-pause-video", () => {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      console.log("Paus...");
    });
  }, []);

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
    console.log("Video Added");
  }

  // sync play
  function syncPlayVideo() {
    if (!isAdmin && !isMod) return;
    socket.current.emit("sync-play-video", { roomCode });
  }

  function syncPauseVideo() {
    if (!isAdmin && !isMod) return;
    socket.current.emit("sync-pause-video", { roomCode });
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
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
