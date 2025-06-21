import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import VideoPlayer from "../components/VideoPlayer";
import SongList from "../components/VideoList";
import Participants from "../components/Participants";
import Chat from "../components/Chat";
import VideoControls from "../components/VideoControls";
import RoomContext from "../context/RoomContext";

function HomePage() {
  const { users, videos, chats } = useContext(RoomContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <NavBar />

      <div className="container mx-auto px-4 py-4 max-w-[90rem]">
        <div className="flex flex-col gap-6">
          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Section (70% width on large screens) */}
            <div className="flex flex-col gap-6 w-full lg:w-[70%]">
              {/* 16:9 Aspect Ratio Container */}
              <div className="relative pt-[56.25%] w-full bg-black rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoPlayer videoId={"N3pcUbRwa5A"} />
                </div>
              </div>

              {/* <VideoControls isAdmin={true} isMod={false} /> */}

              <div className="lg:hidden rounded-xl shadow-xl">
                <Chat chats={chats} />
              </div>

              <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <SongList />
              </div>
            </div>

            {/* Sidebar Section (30% width on large screens) */}
            <div className="flex flex-col gap-6 w-full lg:w-[30%]">
              <div className="hidden lg:flex flex-col rounded-xl shadow-xl h-[500px]">
                <Chat />
              </div>

              <div className="">
                <Participants />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
