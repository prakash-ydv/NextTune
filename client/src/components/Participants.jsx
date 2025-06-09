import React from "react";
import { Users } from "lucide-react";
import UserBox from "./UserBox";

const dummyUsers = [
  {
    name: "Harsh Gupta",
    status: "Watching",
    time: 8,
    isHost: true,
  },
  {
    name: "Siddhart Malotra",
    status: "Watching",
    time: 18,
    isHost: false,
    isMod : true,
  },
  {
    name: "Salman Khan",
    status: "Watching",
    time: 8,
    isHost: false,
  },
  {
    name: "Prakash Kumar",
    status: "Watching",
    time: 18,
    isHost: false,
  },
  {
    name: "Ankit Yadav",
    status: "Left",
    time: 14,
    isHost: false,
  },
  {
    name: "Bobby Kumar Yadav",
    status: "Watching",
    time: 2,
    isHost: false,
  },
  {
    name: "Adil",
    status: "Watching",
    time: 42,
    isHost: false,
  },
];

function Participants() {
  return (
    <div className="flex flex-col h-[500px] p-0 rounded-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden relative">
      {/* Enhanced Sticky Header */}
      <div className="sticky top-0 z-10 overflow-hidden">
        <div className="flex text-sm items-center bg-black/25 gap-4 px-5 py-3 backdrop-blur-3xl">
          <Users className="text-cyan-300" size={20} />
          <h1 className="text-lg text-white font-medium">Participants</h1>
          <span className="ml-auto bg-cyan-900/50 border border-cyan-500/50 text-cyan-300 text-xs px-2 py-0.5 rounded-full">
            {dummyUsers.length}
          </span>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col p-5 gap-1">
          {dummyUsers.map((item, index) => (
            <UserBox
              key={index}
              name={item.name}
              status={item.status}
              time={item.time}
              isHost={item.isHost}
              isMod={item.isMod}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Participants;