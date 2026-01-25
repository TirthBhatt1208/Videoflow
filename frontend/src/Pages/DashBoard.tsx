import {Sidebar , MainContent , UploadProccesing} from "../Componets/index.ts";
import { Protect } from "@clerk/clerk-react";
import Signup from "./Signup.tsx";
import { UserProfile } from "@clerk/clerk-react";
import dashboardSection from "../Store/store.ts";
import VideoUpload from "./VideoUpload.tsx";
const VideoFlowDashboard = () => {
  const { id } = dashboardSection();

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
          <div className="flex-1 overflow-auto p-4 flex justify-center">
            <UploadProccesing />
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
        <Sidebar/>

        {/* Main Content */}
        {renderSection()}
      </div>
    </Protect>
  );
};

export default VideoFlowDashboard;
