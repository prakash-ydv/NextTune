import React from "react";
import { Users } from "lucide-react";
import UserBox from "./UserBox";
import { time } from "framer-motion";

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
    <div className="flex flex-col h-[500px] max-w-2xl p-0 rounded-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-y-auto scrollbar-hide">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10">
        <div className="flex text-sm items-center bg-black/25 gap-4 px-5 py-3 backdrop-blur-3xl">
          <Users className="text-cyan-300" />
          <h1 className="text-lg text-white font-medium">Participants</h1>
          <span className="bg-cyan-900 border border-cyan-500 text-cyan-300 px-2 rounded-full">
            {dummyUsers.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col h-full text-sm justify-between p-5 gap-2">
        {dummyUsers.map((item, index) => (
          <UserBox
            name={item.name}
            status={item.status}
            time={item.time}
            isHost={item.isHost}
          />
        ))}
      </div>
    </div>
  );
}

export default Participants;
