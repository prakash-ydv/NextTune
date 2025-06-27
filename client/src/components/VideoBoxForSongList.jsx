import React, { useState, useEffect, useRef, useContext } from "react";
import { Play, X } from "lucide-react";
import RoomContext from "../context/RoomContext";

function SongBoxForSongList({ title, thumbnail, channel, duration, id }) {
  const { socket, roomCode, syncPlayVideo } = useContext(RoomContext);
  const [videoId, setVideoId] = useState(id);
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isMobile) return;
    const deltaX = e.touches[0].clientX - startX;
    if (deltaX < -50) {
      setIsSwiped(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsSwiped(false);
      }, 3000);
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setStartX(0);
  };

  // remove the video from queue
  function removeVideoFromQueue() {
    if (!socket) return;
    socket.emit("remove-video-from-queue", { videoId, roomCode });
  }

  // play the video
  function playThisVideo() {
    if (!socket) return;
    socket.emit("play-video-from-queue", { videoId, roomCode });
  }

  const showButtons = isSwiped || isHovered;

  return (
    <div
      className={`relative flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
        isMobile && isSwiped ? "-translate-x-16 w-[90vw]" : "translate-x-0"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="w-24 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden">
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
          {duration || "3:45"}
        </div>
        <img
          src={thumbnail}
          alt="thumbnail"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Title + Channel */}
      <div className="flex-1 min-w-0">
        <p className="w-30 sm:w-auto text-white text-sm font-medium line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {title || "Untitled Song"}
        </p>
        <p className="text-gray-400 text-xs mt-1 truncate">
          {channel || "Unknown Channel"}
        </p>
      </div>

      {/* Buttons */}
      {isMobile ? (
        showButtons && (
          <div className="absolute right-0 flex items-center gap-2 transition-opacity duration-300">
            <button
              onClick={() => playThisVideo()}
              title="play"
              className="w-8 h-8 center hover:bg-white/10 rounded-full transition-all"
            >
              <Play className="w-4 h-4 text-green-400" />
            </button>
            <button
              onClick={() => removeVideoFromQueue()}
              title="remove"
              className="w-8 h-8 center hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )
      ) : (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => playThisVideo()}
            title="play"
            className="center w-8 h-8 p-0 hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <Play className="w-3 h-3 text-green-400" />
          </button>
          <button
            onClick={() => removeVideoFromQueue()}
            title="remove"
            className="center w-8 h-8 p-0 hover:bg-red-500/20 rounded-full transition-all duration-200"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}

export default SongBoxForSongList;
