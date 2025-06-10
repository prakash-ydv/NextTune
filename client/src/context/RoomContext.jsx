import React, { createContext, useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

// 1. Create the context
const RoomContext = createContext();

// 2. Create the provider component
export const RoomContextProvider = ({ children }) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000/");

    return () => {
      connection.off();
    };
  }, []);
  return <RoomContext.Provider value={{}}>{children}</RoomContext.Provider>;
};

export default RoomContext;
