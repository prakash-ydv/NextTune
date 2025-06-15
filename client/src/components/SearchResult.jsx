import React, { useState, useEffect, useContext } from "react";
import RoomContext from "../context/RoomContext";

function SearchResult(props) {
  const { addVideoToQueue } = useContext(RoomContext);

  const [addVideo, setAddVideo] = useState("");

  useEffect(() => {
    if (!props.video) return;
    setAddVideo(props.video);
  }, [props]);

  return (
    <div
      className={`relative lg:w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:scale-[1.02]`}
    >
      {/* Thumbnail */}
      <div className="w-24 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden">
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
          {props.duration || "3:45"}
        </div>
        <img
          src={props.thumbnail}
          alt="thumbnail"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Title + Channel */}
      <div className="flex-1 min-w-0">
        <p className="w-40 sm:w-auto text-white text-sm font-medium line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {props.title ||
            "Untitled Song lorem asd da das dasd asdfdafa sdsadasd as das das "}
        </p>
        <p className="text-gray-400 text-xs mt-1 truncate max-w-3/4">
          {props.channel || "Unknown Channel"}
        </p>
      </div>

      <button
        onClick={() => addVideoToQueue(addVideo)}
        className="text-cyan-300 text-lg"
      >
        +
      </button>
    </div>
  );
}

export default SearchResult;
