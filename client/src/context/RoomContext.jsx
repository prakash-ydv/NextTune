import React, {
  createContext,
  useState,
  useRef,
  useEffect,
} from "react";
import io from "socket.io-client";

// 1. Create the context
const RoomContext = createContext();

// 2. Create the provider component
export const RoomContextProvider = ({ children }) => {
  return <RoomContext.Provider value={{}}>{children}</RoomContext.Provider>;
};

export default RoomContext;
