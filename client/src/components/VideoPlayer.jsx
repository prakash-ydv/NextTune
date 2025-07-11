import React, { useContext, useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import RoomContext from "../context/RoomContext";
import { Play, Pause, Settings, Volume2, VolumeOff } from "lucide-react";

const YoutubePlayer = ({ videoId }) => {
  const {
    playerRef,
    syncPlayVideo,
    syncPauseVideo,
    isPlaying,
    togglePlayPause,
    currentVideoId,
  } = useContext(RoomContext);

  const [showControls, setShowControls] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentVideoQuality, setCurrentVideoQuality] = useState("auto");
  const [isMuted, setIsMuted] = useState(false);

  // refs
  const controlsTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const currentTime = useRef("00:00"); //store current time

  const quality = [
    { name: "2160p", code: "hd2160" },
    { name: "1440p", code: "hd1440" },
    { name: "1080p", code: "hd1080" },
    { name: "720p", code: "hd720" },
    { name: "480p", code: "large" },
    { name: "360p", code: "medium" },
    { name: "240p", code: "small" },
    { name: "144p", code: "tiny" },
    { name: "Auto", code: "auto" },
  ];

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

  // change quality
  function changeQuality(quality, name) {
    if (!playerRef.current) return;
    setCurrentVideoQuality(name);
    setShowQualityMenu(false);
  }

  // handle mute and unmute
  function handleMute() {
    if (!playerRef.current) return;
    setIsMuted((prev) => !prev);
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
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
      autoplay: 1,
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

        <div className="w-[97%] absolute bottom-2 md:bottom-5">
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

          {/* controler buttons */}
          <div className="px-1 flex items-center gap-3 md:gap-4">
            <span className="text-xs text-gray-500">
              {currentTime.current} / {getVideoDuration()}
            </span>

            {/*  quality*/}

            <button
              onClick={() => setShowQualityMenu(true)}
              className="quality-btn text-xs text-gray-500"
            >
              {currentVideoQuality}
            </button>

            <div
              id="quality-buttons"
              className={`${
                showQualityMenu ? "flex" : "hidden"
              } absolute flex-col gap-1 text-xs text-gray-500 bottom-8 left-22 bg-black/50 p-2 rounded-lg transition-all duration-300`}
            >
              {quality.map((item, index) => (
                <button
                  key={index}
                  className={`${
                    currentVideoQuality == item.name
                      ? "text-cyan-500"
                      : "text-gray-500"
                  } quality-btn text-xs`}
                  onClick={() => changeQuality(item.code, item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button onClick={() => handleMute()}>
              {isMuted ? (
                <VolumeOff size={15} className="text-gray-500" />
              ) : (
                <Volume2 size={15} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;
