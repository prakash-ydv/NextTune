import { Crown, User } from "lucide-react";
import React from "react";

function UserBox(props) {
  return (
    <div
      id="user-box"
      className="flex justify-between  p-2 rounded-lg text-white/25 cursor-pointer hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex gap-5">
        <div
          id="iamge-box"
          className="center h-14 w-14 rounded-full border border-cyan-300"
        >
          <User />
        </div>

        <div className="flex flex-col text-xs">
          <h1 className="text-cyan-300 text-lg">{props.name}</h1>
          <div className="flex gap-1">
            <span>{props.status}</span>•<span>{props.time} m Ago</span>
          </div>
        </div>
      </div>

      <span title="host" className="my-auto text-yellow-500">
        {" "}
        {props.isHost ? <Crown /> : ""}
      </span>
    </div>
  );
}

export default UserBox;
