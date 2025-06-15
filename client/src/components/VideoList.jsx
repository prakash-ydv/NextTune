import React, { useContext, useState } from "react";
import { Plus, Search } from "lucide-react";
import SongBoxForSongList from "./VideoBoxForSongList";
import { AnimatePresence, motion } from "framer-motion";
import RoomContext from "../context/RoomContext";
import SearchResult from "./SearchResult";
import searchVideo from "../api/searchVideo";

function SongList() {
  const { videos, isAdmin, isMod } = useContext(RoomContext);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const [query, setQuery] = useState("");

  function toggleSearchActive() {
    setIsSearchActive((prev) => !prev);
  }

  async function handleSearchVideo(e, query) {
    e.preventDefault();
    if (!query) return;
    const videos = await searchVideo(query);
    console.log(videos);
    setQuery("");
    setSearchResult(videos);
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
            className={` ${
              isAdmin || isMod ? "flex" : "hidden"
            } items-center px-2 py-1 rounded-lg gap-2 text-cyan-400 hover:bg-cyan-400/10 hover:scale-105 hover:text-white transition-all duration-200 cursor-pointer`}
          >
            {isSearchActive ? (
              "Done"
            ) : (
              <>
                <Search size={20} />
                <span>Search</span>
              </>
            )}
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
              <form
                onSubmit={(e) => handleSearchVideo(e, query)}
                className="w-full flex"
              >
                <input
                  spellCheck={false}
                  className="w-full h-10 border border-cyan-300 rounded-l-lg px-2 py-1 outline-none text-white bg-transparent"
                  type="text"
                  placeholder="Search videos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <input
                  className="h-10 bg-cyan-300 px-2 py-1 border border-cyan-300 rounded-r-lg cursor-pointer"
                  type="submit"
                  value={"Search"}
                />
              </form>

              {searchResult ? (
                <div className="w-full h-full flex flex-col center ">
                  {searchResult ? "" : <h1>Admin can add videos</h1>}
                  {searchResult?.map((item, index) => (
                    <SearchResult
                      video={item}
                      thumbnail={item.snippet?.thumbnails.default.url}
                      title={item.snippet?.title}
                      channel={item.snippet?.channelTitle}
                      addVideoInfo={item}
                      key={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full gap-2 items-center justify-center text-cyan-300 text-lg font-light">
                  <Search size={48} />
                  <h1>Search video...</h1>
                </div>
              )}
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
              {videos.length > 0 &&
                videos?.map((item, index) => (
                  <SongBoxForSongList
                    key={index}
                    title={item.snippet.title}
                    channel={item.snippet.channelTitle}
                    thumbnail={item.snippet.thumbnails.default.url}
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
