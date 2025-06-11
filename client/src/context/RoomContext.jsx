import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";

// 1. Create the context
const RoomContext = createContext();

// 2. Create the provider component
export const RoomContextProvider = ({ children }) => {
  const socket = useRef(null);
  const [myName, setMyName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [chats, setChats] = useState([]);
  const [videos, setVideos] = useState({});
  const [users, setUsers] = useState([]);

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

      localStorage.setItem("room-code", roomCode);
      console.log("Room Created with code", roomCode);
    });

    return () => {
      localStorage.removeItem("room-code");
      socket.current.off("room-created");
    };
  }, []);

  //   create room function
  function createRoom(e) {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit("create-room", { name: myName, roomName });
    }
  }

  return (
    <RoomContext.Provider
      value={{
        createRoom,
        myName,
        setMyName,
        roomName,
        setRoomName,
        roomCode,
        socket: socket.current,
        users,
        videos,
        chats,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
