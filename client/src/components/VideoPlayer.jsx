import React, { useContext } from "react";
import YouTube from "react-youtube";
import RoomContext from "../context/RoomContext";

const YoutubePlayer = ({ videoId }) => {
  const { playerRef, syncPlayVideo, syncPauseVideo, isPlaying } =
    useContext(RoomContext);

  function setPlayerRef(e) {
    playerRef.current = e;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      showinfo: 0,
    },
  };

  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto  rounded-lg overflow-hidden">
      <YouTube
        onReady={(e) => setPlayerRef(e.target)}
        onPlay={() => syncPlayVideo()}
        onPause={() => syncPauseVideo()}
        videoId={videoId}
        opts={opts}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default YoutubePlayer;
