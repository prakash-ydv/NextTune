import React, { useState, useEffect } from "react";
import { Copy, LogOut, Menu, Play, Settings, UserPlus, X } from "lucide-react";

function NavBar() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  useEffect(() => {
    if (isMenuActive) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up on unmount (in case component is removed while menu is open)
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuActive]);

  function toggleMenu() {
    setIsMenuActive((prev) => !prev);
  }
  return (
    <>
      <div className="w-full flex justify-between items-center px-5 lg:px-20 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl relative">
        {/* logo container */}
        <div className="flex items-center gap-5 ">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            WeTube
          </h1>
        </div>

        {/* buttons */}
        <div className="hidden lg:flex items-center gap-5 text-sm">
          <button
            name="invite friends"
            className="flex items-center gap-2 justify-center h-9 px-3 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
          >
            <UserPlus size={15} />
            Invite
          </button>
          <button
            name="copy room code"
            className="flex items-center gap-2 justify-center h-9 px-3 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
          >
            <Copy size={15} /> Room Code
          </button>
          <button
            name="settings"
            className="flex items-center gap-2 justify-center h-9 px-3 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
          >
            <Settings size={15} />
          </button>
        </div>

        <button onClick={() => toggleMenu()} className="lg:hidden text-white">
          {isMenuActive ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className={`${
          isMenuActive ? "absolute" : "hidden"
        } w-[100vw] h-[95vh] flex flex-col top-15 items-center justify-center gap-2 backdrop-blur-xl text-sm z-99`}
      >
        {/* buttons for phone view */}
        <button className="flex items-center gap-2 justify-center h-9 w-42 px-2 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5">
          <UserPlus size={15} />
          Invite
        </button>
        <button className="flex items-center gap-2 justify-center h-9 w-42 px-2 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5">
          <Copy size={15} /> Room Code
        </button>
        <button className="flex items-center gap-2 justify-center h-9 w-42 px-2 border rounded-md border-white/20 text-red-500 hover:bg-red-500/10 bg-white/5">
          <LogOut size={15} /> Leave
        </button>
      </div>
    </>
  );
}

export default NavBar;
