import React, { useContext, useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import RoomContext from "../context/RoomContext";
import { Play, Pause } from "lucide-react";

const YoutubePlayer = ({ videoId }) => {
  const {
    playerRef,
    syncPlayVideo,
    syncPauseVideo,
    isPlaying,
    togglePlayPause,
  } = useContext(RoomContext);

  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const progressIntervalRef = useRef(null);
  const currentTime = useRef("00:00"); //store current time

  // Handle player ready
  function setPlayerRef(e) {
    playerRef.current = e.target;
    const videoDuration = playerRef.current.getDuration();
    setVideoDuration(videoDuration);
    console.log(videoDuration);
    if (isPlaying) {
      e.target.playVideo();
      startProgressTracking();
    } else {
      e.target.pauseVideo();
      stopProgressTracking();
    }
  }

  // Show controls temporarily (3 seconds)
  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Track video progress
  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Handle seek only when controls are visible
  const handleSeek = (e) => {
    if (!showControls) return;

    const seekPercentage = e.target.value;
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo((seekPercentage / 100) * duration, true);
      setProgress(seekPercentage);
    }
    showControlsTemporarily();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimeout(controlsTimeoutRef.current);
      stopProgressTracking();
    };
  }, []);

  function getVideoDuration() {
    const seconds = Math.floor(videoDuration % 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((videoDuration - seconds) / 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function currentTimeOfVideo(time) {
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    if (!playerRef.current) return;

    const intervalId = setInterval(() => {
      const time = playerRef.current.getCurrentTime();
      if (typeof time === "number") {
        currentTime.current = currentTimeOfVideo(time);
      } else if (time instanceof Promise) {
        time.then((t) => {
          currentTime.current = currentTimeOfVideo(t);
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [playerRef, isPlaying]); // Use the ref object, not playerRef.current

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      showinfo: 0,
      moreVideos: 0,
    },
  };

  return (
    <div
      className="relative aspect-video w-full mx-auto rounded-lg overflow-hidden"
      onClick={showControlsTemporarily}
    >
      <YouTube
        onReady={setPlayerRef}
        onPlay={() => {
          syncPlayVideo();
          startProgressTracking();
        }}
        onPause={() => {
          syncPauseVideo();
          stopProgressTracking();
        }}
        videoId={videoId}
        opts={opts}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Controls overlay - always interactive */}
      <div
        className={`h-full w-full flex flex-col items-center justify-center absolute hover:opacity-100 z-10 bg-gradient-to-t from-black via-black/10 to-transparent transition-all duration-400 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
            showControlsTemporarily();
          }}
          className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition-all"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <div className="w-[98%] absolute bottom-0 md:bottom-5">
          <div className="w-full flex items-center gap-2">
            {/* Only disable pointer events for the seek bar when controls are hidden */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className={`w-full rounded-full cursor-pointer h-1 ${
                !showControls ? "pointer-events-none" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            />

            <button title="sync" className="text-xs animate-pulse">
              Live
            </button>
          </div>
          <div className="px-1">
            <span className="text-xs text-gray-500">
              {currentTime.current} / {getVideoDuration()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;
