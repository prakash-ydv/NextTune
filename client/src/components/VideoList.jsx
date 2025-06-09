import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import SongBoxForSongList from "./VideoBoxForSongList";
import { AnimatePresence, motion } from "framer-motion";

const dummySongs = [
  { title: "ipsum dolor...", channel: "Discovery Channel", thumbnail: "" },
  { title: "Mountain Adventures", channel: "Adventure TV", duration: "12:30", thumbnail: "from-green-500/20 to-blue-500/20" },
  { title: "Desert Landscapes", channel: "Nature Plus", thumbnail: "from-orange-500/20 to-red-500/20" },
  { title: "ipsum dolor...", channel: "Discovery Channel", thumbnail: "" },
  { title: "Mountain Adventures", channel: "Adventure TV", duration: "12:30", thumbnail: "from-green-500/20 to-blue-500/20" },
  { title: "Desert Landscapes", channel: "Nature Plus", thumbnail: "from-orange-500/20 to-red-500/20" },
];

function SongList() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  function toggleSearchActive() {
    setIsSearchActive((prev) => !prev);
  }

  return (
    <div
      id="SongList"
      className="flex flex-col h-[500px] p-0 rounded-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden relative"
    >
      {/* Sticky Header - Updated to match Chat component */}
      <div className="sticky top-0 z-10 overflow-hidden">
        <div className="flex text-sm items-center bg-black/25 justify-between px-5 py-3 backdrop-blur-3xl border-b border-white/10">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-cyan-400" />
            <span className="text-xl font-medium text-white">
              {isSearchActive ? "Add Video" : "Up Next"}
            </span>
          </div>
          <div
            onClick={toggleSearchActive}
            className="flex items-center px-2 py-1 rounded-lg gap-2 text-cyan-400 hover:bg-cyan-400/10 hover:scale-105 hover:text-white transition-all duration-200 cursor-pointer"
          >
            {isSearchActive ? "Done" : <>
              <Search size={20} />
              <span>Search</span>
            </>}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {isSearchActive ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full text-sm justify-between p-5 gap-2"
            >
              <form className="w-full flex">
                <input
                  spellCheck={false}
                  className="w-full h-10 border border-cyan-300 rounded-l-lg px-2 py-1 outline-none text-white bg-transparent"
                  type="text"
                  placeholder="Search videos..."
                />
                <input
                  className="h-10 bg-cyan-300 px-2 py-1 border border-cyan-300 rounded-r-lg cursor-pointer"
                  type="submit"
                  value={"Search"}
                />
              </form>

              <div className="flex h-full gap-2 items-center justify-center text-cyan-300 text-lg font-light">
                <Search size={48} />
                <h1>Search video...</h1>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 px-5 py-4"
            >
              {dummySongs.map((item, index) => (
                <SongBoxForSongList
                  key={index}
                  title={item.title}
                  channel={item.channel}
                  thumbnail={item.thumbnail}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SongList;