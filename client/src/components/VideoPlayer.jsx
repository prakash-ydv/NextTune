import React from "react";
import YouTube from "react-youtube";

const YoutubePlayer = ({ videoId }) => {
  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding : 1,
      showinfo : 0
    },
  };

  return (
    
    <div className="relative aspect-video w-full max-w-4xl mx-auto  rounded-lg overflow-hidden">
      <YouTube videoId={videoId} opts={opts} className="absolute top-0 left-0 w-full h-full" />
      
    </div>
  );
};

export default YoutubePlayer;
