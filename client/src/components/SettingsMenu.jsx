import React, { useContext, useEffect, useState } from "react";
import {
  Settings,
  X,
  UserPlus,
  Lock,
  Volume2,
  Moon,
  Sun,
  Unlock,
  HandCoins,
  MessageCircle,
  MessageCircleOff,
} from "lucide-react";
import RoomContext from "../context/RoomContext";

function SettingsMenu() {
  const { playerRef } = useContext(RoomContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [isChatLocked, setIsChatLocked] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [audioVolume, setAudioVolume] = useState(80);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!playerRef.current) return;

    playerRef.current.setVolume(Number(audioVolume));
  }, [audioVolume]);

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={toggleMenu}
        className="fixed z-50 p-2 rounded-full bg-gray-800/80 backdrop-blur-md border border-gray-700 hover:bg-gray-700 transition-all shadow-lg"
        aria-label="Settings"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-300" />
        ) : (
          <Settings className="w-5 h-5 text-gray-300" />
        )}
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed right-20 top-20 z-9999 w-72 p-4 bg-gray-800 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Room Settings
          </h3>

          <div className="space-y-4">
            {/* Room Lock handle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isRoomLocked ? (
                  <Lock className="w-5 h-5 text-red-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-green-400" />
                )}
                <span className={``}>Room Lock</span>
              </div>
              <button
                onClick={() => setIsRoomLocked(!isRoomLocked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isRoomLocked ? "bg-red-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isRoomLocked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* ChatLock handle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isChatLocked ? (
                  <MessageCircleOff className="w-5 h-5 text-cyan-400" />
                ) : (
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                )}
                <span className="text-gray-300">Chat Lock</span>
              </div>
              <button
                onClick={() => setIsChatLocked(!isChatLocked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isChatLocked ? "bg-cyan-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isChatLocked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Volume</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => setAudioVolume(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-xs text-gray-400 text-right">
                {audioVolume}%
              </div>
            </div>

            {/* suggest feature */}
            <div className="pt-2 border-t border-gray-700">
              <button className="w-full flex center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-700/50 transition-colors">
                <HandCoins /> Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsMenu;
