import React, { useState, useEffect, useContext } from "react";
import { Copy, LogOut, Menu, Play, Settings, UserPlus, X } from "lucide-react";
import RoomContext from "../context/RoomContext";
import SettingsMenu from "./SettingsMenu";

function NavBar() {
  const { roomCode } = useContext(RoomContext);

  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isCopied, setIsCopied] = useState(true);

  //hide menu
  useEffect(() => {
    if (isMenuActive) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuActive]);

  function toggleMenu() {
    setIsMenuActive((prev) => !prev);
  }

  // handle share
  function handleInvite() {
    if (!roomCode) return;
    const dynamicLink = `https://nexttune.com/room/${roomCode}`;
    const message = `Yo! 🎶
I just opened a room on NextTune – it's like a party, but you don’t have to wear pants 😂🩳
Come vibe with me: ${dynamicLink}`;

    if (navigator.share) {
      navigator
        .share({
          title: "NextTune Invite",
          text: message,
          url: dynamicLink,
        })
        .then(() => console.log("Invite shared"))
        .catch((error) => console.error("Share failed:", error));
    } else {
      // Fallback to WhatsApp
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
    }
  }

  // handle copy
  function handleCopy() {
    navigator.clipboard
      .writeText(roomCode)
      .then(() => {
        console.log("Copied to clipboard!");
        // Optionally show a toast or alert
      })
      .then(handleCopyButton)

      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }

  function handleCopyButton() {
    setTimeout(() => {
      setIsCopied(true);
    }, 3000);

    setIsCopied(false);
  }

  return (
    <>
      <div className="w-full flex justify-between items-center px-5 lg:px-20 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl relative z-50">
        {/* logo container */}
        <div className="flex items-center gap-5 ">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            NextTune
          </h1>
        </div>

        {/* buttons */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <button
            onClick={() => handleInvite()}
            name="invite friends"
            className="flex items-center gap-2 justify-center h-9 px-3 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
          >
            <UserPlus size={15} />
            Invite
          </button>
          <button
            onClick={(e) => handleCopy(e)}
            title="copy room code"
            className="flex items-center gap-2 justify-center h-9 w-32 px-3 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
          >
            <Copy size={15} />
            {isCopied ? `ID: ${roomCode}` : "Copied"}
          </button>

          <button
            title="Leave room"
            className="flex items-center gap-2 justify-center h-9 px-2 border rounded-md border-white/20 text-red-500 hover:bg-red-500/10 bg-white/5"
          >
            <LogOut size={15} /> Leave
          </button>

          <div
            title="settings"
            className="mx-2 relative flex items-center gap-2 justify-center h-9 px-3 "
          >
            <SettingsMenu />
          </div>
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
        <button
          onClick={() => handleInvite()}
          className="flex items-center gap-2 justify-center h-9 w-42 px-2 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
        >
          <UserPlus size={15} />
          Invite
        </button>
        <button
          onClick={() => handleCopy()}
          className="flex items-center gap-2 justify-center h-9 w-42 px-2 border rounded-md border-white/20 text-white hover:bg-white/10 bg-white/5"
        >
          <Copy size={15} />
          {isCopied ? "Room Code" : "Copied"}
        </button>
        <button className="flex items-center gap-2 justify-center h-9 w-42 px-2 border rounded-md border-white/20 text-red-500 hover:bg-red-500/10 bg-white/5">
          <LogOut size={15} /> Leave
        </button>
      </div>
    </>
  );
}

export default NavBar;
