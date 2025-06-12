import React, { useContext } from "react";
import RoomContext from "../context/RoomContext";

function CreateOrJoinRoom() {
  const {
    myName,
    setMyName,
    roomName,
    setRoomName,
    createRoom,
    joinRoom,
    joinRoomName,
    setJoinRoomName,
    joinRoomCode,
    setJoinRoomCode,
  } = useContext(RoomContext);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-10">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Create Room Card */}
        <div className="group relative flex-1">
          <div className="absolute -inset-1 rounded-2xl opacity-75 blur transition-all duration-500 group-hover:opacity-100"></div>
          <div className="relative h-full bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl mb-5 font-bold text-white">
                Create Room
              </h2>

              <form className="space-y-5" onSubmit={(e) => createRoom(e)}>
                <input
                  id="create-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  value={myName}
                  onChange={(e) => setMyName(e.target.value)}
                />

                <input
                  id="room-name"
                  type="text"
                  required
                  placeholder="Choose a room name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />

                <input
                  type="submit"
                  value={"Create Room"}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                ></input>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center lg:flex-col">
          <div className="w-full h-px lg:w-px lg:h-24 bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
          <span className="px-4 py-2 text-gray-400 font-medium">OR</span>
          <div className="w-full h-px lg:w-px lg:h-24 bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
        </div>

        {/* Join Room Card */}
        <div className="group relative flex-1">
          <div className="absolute -inset-1  rounded-2xl opacity-75 blur transition-all duration-500 group-hover:opacity-100"></div>
          <div className="relative h-full bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-5">Join Room</h2>

              <form onSubmit={(e) => joinRoom(e)} className="space-y-5">
                <input
                  id="join-name"
                  type="text"
                  required
                  minLength={3}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  onChange={(e) => {
                    setJoinRoomName(e.target.value);
                    e.target.setCustomValidity("");
                  }}
                  value={joinRoomName}
                  onInvalid={(e) => {
                    e.target.setCustomValidity(
                      "Name should be of 3 or more letters"
                    );
                  }}
                />

                <input
                  id="room-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all tracking-widest text-center text-lg font-mono"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                    setJoinRoomCode(value);
                    e.target.setCustomValidity(""); 
                  }}
                  value={joinRoomCode}
                  onInvalid={(e) => {
                    e.target.setCustomValidity(
                      "Please enter a valid 6-digit code"
                    );
                  }}
                />

                <input
                  type="submit"
                  value={"Join Room"}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                ></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrJoinRoom;
