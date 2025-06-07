import React from "react";
import { Plus, Search } from "lucide-react";
import SongBoxForSongList from "./VideoBoxForSongList";

const dummySongs = [
  {
    title: "ipsum dolor sit amet consectetur, adipisicing elit. Explicabo aliquid maxime in! Explicabo, mollitia modi?",
    channel: "Discovery Channel",
    thumbnail: "",
  },
  {
    title: "Mountain Adventures",
    channel: "Adventure TV",
    duration: "12:30",
    thumbnail: "from-green-500/20 to-blue-500/20",
  },
  {
    title: "Desert Landscapes",
    channel: "Nature Plus",
    thumbnail: "from-orange-500/20 to-red-500/20",
  },
  {
    title: "Mountain Adventures",
    channel: "Adventure TV",
    duration: "12:30",
    thumbnail: "from-green-500/20 to-blue-500/20",
  },
  {
    title: "Desert Landscapes",
    channel: "Nature Plus",
    thumbnail: "from-orange-500/20 to-red-500/20",
  },
  {
    title: "Mountain Adventures",
    channel: "Adventure TV",
    duration: "12:30",
    thumbnail: "from-green-500/20 to-blue-500/20",
  },
  {
    title: "Desert Landscapes",
    channel: "Nature Plus",
    thumbnail: "from-orange-500/20 to-red-500/20",
  },
  {
    title: "Mountain Adventures",
    channel: "Adventure TV",
    duration: "12:30",
    thumbnail: "from-green-500/20 to-blue-500/20",
  },
  {
    title: "Desert Landscapes",
    channel: "Nature Plus",
    thumbnail: "from-orange-500/20 to-red-500/20",
  },
];

function SongList() {
  return (
    <div
      id="SongList"
      className="flex flex-col max-h-[550px] max-w-2xl p-0 rounded-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-y-auto scrollbar-hide"
    >
      {/* Sticky header wrapper */}
      <div className="sticky top-0 z-10">
        <div className="flex text-sm items-center bg-black/25 justify-between px-5 py-3 backdrop-blur-3xl ">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-cyan-400" />
            <span className="text-xl text-white">Up Next</span>
          </div>
          <div className="flex items-center px-2 py-1 rounded-lg gap-2 text-cyan-400 hover:bg-cyan-400/10 hover:scale-105 hover:text-white transition-all duration-200">
            <Search size={20} />
            <button>Add Video</button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="">
        {dummySongs.map((item, index) => (
          <SongBoxForSongList
            key={index}
            title={item.title}
            channel={item.channel}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}

export default SongList;
