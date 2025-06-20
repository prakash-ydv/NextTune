import React, { useEffect, useState } from "react";
import { Crown, User, Wrench } from "lucide-react";

function UserBox(props) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60 * 1000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const joinTime = Math.floor((currentTime - props.joinedTime) / (1000 * 60));
  const joinTimeDisplay = joinTime > 0 ? `${joinTime} m ago` : "just now";

  const leftTime = Math.floor((currentTime - props.leftTime) / (1000 * 60));
  const leftTimeDisplay = leftTime > 0 ? `${leftTime} m ago` : "just now";

  return (
    <div
      id="user-box"
      className="flex justify-between  p-2 rounded-lg text-white/25 cursor-pointer hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex gap-5">
        <div
          id="iamge-box"
          className="center h-12 w-12 rounded-full border border-cyan-300"
        >
          <User />
        </div>

        <div className="flex flex-col text-xs">
          <h1 className="text-cyan-300 text-sm ">{props.name}</h1>
          <div className="flex gap-1">
            {props.isLeft ? (
              <>
                <span>{props.status}</span>•<span>{leftTimeDisplay}</span>
              </>
            ) : (
              <>
                <span>{props.status}</span>•<span>{joinTimeDisplay}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <span title="host" className="my-auto text-yellow-500">
        {props.isHost && <Crown />}
        {props.isMod && <Wrench className="text-green-500" />}
      </span>
    </div>
  );
}

export default UserBox;
