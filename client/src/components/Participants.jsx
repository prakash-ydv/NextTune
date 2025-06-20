import React, { useContext } from "react";
import { Users } from "lucide-react";
import UserBox from "./UserBox";
import RoomContext from "../context/RoomContext";

function Participants() {
  const { users } = useContext(RoomContext);

  return (
    <div className="flex flex-col h-[500px] p-0 rounded-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden relative">
      {/* Enhanced Sticky Header */}
      <div className="sticky top-0 z-10 overflow-hidden">
        <div className="flex text-sm items-center bg-black/25 gap-4 px-5 py-3 backdrop-blur-3xl">
          <Users className="text-cyan-300" size={20} />
          <h1 className="text-lg text-white font-medium">Participants</h1>
          <span className="ml-auto bg-cyan-900/50 border border-cyan-500/50 text-cyan-300 text-xs px-2 py-0.5 rounded-full">
            {users.length}
          </span>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col p-5 gap-1">
          {users.map((item, index) => (
            <UserBox
              key={index}
              name={item.name}
              status={item.status}
              time={item.time}
              isHost={item.isHost}
              isMod={item.isMod}
              joinedTime={item.joinedTime}
              isLeft={item.isLeft}
              leftTime={item.leftTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Participants;
