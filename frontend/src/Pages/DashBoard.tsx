import {
  Sidebar,
  MainContent,
  UploadProccesing,
  Videoplayer,
} from "../Componets/index.ts";
import { Protect } from "@clerk/clerk-react";
import Signup from "./Signup.tsx";
import { UserProfile } from "@clerk/clerk-react";
import dashboardSection from "../Store/store.ts";
import VideoUpload from "./VideoUpload.tsx";
import React, { useEffect, useState } from "react";
import { getCloudUrls } from "../Api/getApis.ts";
import videojs from "video.js";

type Thumbnail = {
  url: string;
};
type Video = {
  id: string;
  masterPlaylistUrl: string;
  vttUrl: string;
  thumbnail: Thumbnail[];
};
const VideoFlowDashboard = () => {
  const { id } = dashboardSection();
  const [videos, setVideos] = useState<Video[]>([]);


   const playerRef = React.useRef(null);


  interface VideoJsPlayer {
    on(event: string, callback: () => void): void;
  }

  const handlePlayerReady = (player: VideoJsPlayer): void => {
    (playerRef as React.MutableRefObject<VideoJsPlayer | null>).current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };


  useEffect(() => {
   if (id === "videos") {
    const getUrls = async () => {
      const response = await getCloudUrls()

      const data = response.data.data.videos

      setVideos(data)
    }
    getUrls()
   }
  }, [id]);
  const renderSection = () => {
    switch (id) {
      case "":
        return <MainContent />;
      case "profile":
        return (
          <div className="flex-1 overflow-auto p-4 flex justify-center">
            <UserProfile />
          </div>
        );
      case "upload":
        return (
          <div className="flex-1 overflow-auto p-4 flex justify-center">
            <VideoUpload />
          </div>
        );
      case "videoUploading":
        return (
          <div className="flex-1 overflow-auto p-6 bg-gray-700">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Uploading Your Video...
                </h2>
                <p className="text-gray-600">
                  Please do not close this window.
                </p>
              </div>

              <UploadProccesing />

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-black font-bold text-center pt-2">
                  Video processing will begin automatically once the upload is
                  complete.
                </p>
              </div>
            </div>
          </div>
        );
      case "videos":
        return (
          <div className="flex-1 min-w-0 overflow-auto p-6 bg-gray-700">
            <div
              className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-6
      "
            >
              {videos.map((video, idx) => {
                let masterUrl = video.masterPlaylistUrl;

                // ✅ Auto-fix wrong URLs
                if (
                  masterUrl.includes("/v0/") ||
                  masterUrl.includes("/v1/") ||
                  masterUrl.includes("/v2/") ||
                  masterUrl.includes("/v3/")
                ) {
                  // Extract video ID and construct correct master URL
                  const videoIdMatch = masterUrl.match(/processed\/([^\/]+)\//);
                  const videoId = videoIdMatch ? videoIdMatch[1] : null;

                  if (videoId) {
                    // Get cloudinary base from existing URL
                    const cloudinaryBase = masterUrl.split("/raw/upload/")[0];
                    const versionMatch = masterUrl.match(/\/v(\d+)\//);
                    const version = versionMatch ? versionMatch[1] : "";

                    masterUrl = `${cloudinaryBase}/raw/upload/v${version}/processed/${videoId}/master.m3u8`;

                    console.log(`🔧 Fixed URL for video ${idx}:`, masterUrl);
                  }
                }

                // ✅ Ensure .m3u8 extension
                if (
                  !masterUrl.endsWith(".m3u8") &&
                  masterUrl.includes("master")
                ) {
                  masterUrl = `${masterUrl}.m3u8`;
                }

                const options = {
                  autoplay: false,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  sources: [
                    {
                      src: masterUrl,
                      type: "application/x-mpegURL",
                    },
                  ],
                };

                console.log(`📺 Video ${idx} final URL:`, masterUrl);

                return (
                  <Videoplayer
                    key={video.id}
                    options={options}
                    onReady={handlePlayerReady}
                    video={video}
                  />
                );
              })}
            </div>
          </div>
        );
      default:
        return <MainContent />; // fallback
    }
  };

  return (
    <Protect fallback={<Signup />}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        {renderSection()}
      </div>
    </Protect>
  );
};

export default VideoFlowDashboard;
