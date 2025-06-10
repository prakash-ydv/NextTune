import React, { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

function VideoControls(props) {
  const { isAdmin, isMod } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [canControl, setCanControl] = useState(false);

  useEffect(() => {
    if (isAdmin === true || isMod === true) {
      setCanControl(true);
    } else {
      setCanControl(false);
    }
  }, [isAdmin, isMod]);

  function togglePlayButton() {
    setIsPlaying((prev) => !prev);
  }
  return (
    <div
      className={`${
        canControl ? "flex" : "hidden"
      } w-full items-center justify-center h-16 text-white gap-5 bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 rounded-md`}
    >
      <button title="previous">
        <SkipBack />
      </button>
      <button
        title="play/pause"
        onClick={() => togglePlayButton()}
        className="center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white"
      >
        {isPlaying ? <Play /> : <Pause />}
      </button>
      <button title="next">
        <SkipForward />
      </button>
    </div>
  );
}

export default VideoControls;
