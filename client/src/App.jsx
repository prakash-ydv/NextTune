import React, { useContext } from "react";
import HomePage from "./pages/HomePage";
import CreateOrJoinRoom from "./pages/CreateOrJoinRoom";
import RoomContext from "./context/RoomContext";

function App() {
  const { roomCode } = useContext(RoomContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      {roomCode ? <HomePage /> : <CreateOrJoinRoom />}
    </div>
  );
}

export default App;
