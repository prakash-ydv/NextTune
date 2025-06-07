import React from "react";
import NavBar from "../components/NavBar";
import VideoPlayer from "../components/VideoPlayer";
import SongList from "../components/VideoList";
import Participants from "../components/Participants";
import Chat from "../components/Chat";

function HomePage() {
  return (
    <>
      <NavBar />
      <div id="video-container" className="px-4 py-6 flex justify-center">
        <div className="flex flex-col w-full gap-5">
          <VideoPlayer />
          <Chat />
          <Participants />
          <SongList />
        </div>
      </div>
    </>
  );
}

export default HomePage;
