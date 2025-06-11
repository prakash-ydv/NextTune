import React, { useContext, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { MessageCircleMore, Send } from "lucide-react";
import RoomContext from "../context/RoomContext";

function Chat() {
  const { chats } = useContext(RoomContext);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom of message area
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats.length]); // Only when messages change

  function realTime(unix) {
    const unixTimestamp = unix; // example UNIX timestamp
    const date = new Date(unixTimestamp); // Convert to milliseconds

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const timeString = `${hours}:${minutes}`;
    return timeString;
  }

  return (
    <div className="flex flex-col h-[500px] p-0 rounded-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10">
        <div className="flex text-sm items-center bg-black/25 gap-4 px-5 py-3 backdrop-blur-3xl">
          <h1 className="text-lg text-white font-medium">Live Chat</h1>

          {/* Typing indicator */}
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Scrollable message area */}
      <div
        className="flex-1 flex-col overflow-y-auto px-5 py-2 scrollbar-hide"
        ref={messagesContainerRef}
      >
        {chats.map((item, index) => (
          <ChatMessage
            key={index}
            userName={item.name}
            userMessage={item.message}
            time={realTime(item.time)}
            isAdmin={item.isAdmin}
            isMod = {item.isMod}
          />
        ))}
      </div>

      {/* Message form at bottom */}
      <form
        title="message"
        className="w-full flex items-center text-sm px-5 py-2 border-t border-cyan-900 backdrop-blur"
      >
        <input
          className="w-full h-8 px-3 rounded text-white focus:outline-none"
          type="text"
          placeholder="Type message"
        />

        <button
          type="submit"
          value={""}
          className="center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-2 px-5 rounded-md hover:scale-105 transition-all duration-300"
        >
          <Send className="text-white " />
        </button>
      </form>
    </div>
  );
}

export default Chat;
