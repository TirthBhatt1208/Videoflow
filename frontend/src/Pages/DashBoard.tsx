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
import  Videoplayer  from "../Componets/videoPlayer/videoplayer.tsx";
import { useEffect, useState } from "react";
import { getCloudUrls } from "../Api/getApis.ts";
const VideoFlowDashboard = () => {
  const { id } = dashboardSection();
  interface Video {
    masterPlaylistUrl: string;
    vttUrl: string;
    thumbnail?: { url?: string }[];
  }
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
   const fetchVideos = async () => {
     if (id === "videos") {
       const response = await getCloudUrls();
       const data = response.data.data.videos;
       setVideos(data);
     }
   };

   fetchVideos();
  } , [id])
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
          <div className="flex-1 overflow-auto p-6 bg-gray-900 text-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video, index) => (
                <Videoplayer
                  key={index}
                  url={video.masterPlaylistUrl}
                  thumbnailVttUrl={video.vttUrl!}
                  poster={video.thumbnail?.[0]?.url}
                />
              ))}
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
