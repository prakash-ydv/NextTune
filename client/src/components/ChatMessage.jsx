import { Crown } from "lucide-react";
import React from "react";

function ChatMessage(props) {
  const msg = {
    user: "Gopi Bahu",
    message: "Hello Kaisab Ba",
  };
  return (
    <div
      key={""}
      className="group hover:bg-white/5 -mx-2 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className=" mt-1 ">
          <div className="w-8 h-8 center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xs">
            {props.userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">
              {props.userName}
            </span>
            {msg.isHost && <Crown className="w-3 h-3 text-amber-400" />}
            <span className="text-xs text-gray-400">{props.time}</span>
            {props.isAdmin ? <Crown size={15}className="text-yellow-500" /> : ""}
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {props.userMessage}
          </p>
          <div className="flex items-center gap-1 mt-2 flex-wrap"></div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
