import React, { useState } from "react";
import {Sidebar , MainContent} from "../Componets/index.ts";
import { Protect } from "@clerk/clerk-react";
import Signup from "./Signup.tsx";
import { UserProfile } from "@clerk/clerk-react";
import dashboardSection from "../Store/store.ts";
const VideoFlowDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
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
      default:
        return <MainContent />; // fallback
    }
  };


  return (
    <Protect fallback={<Signup />}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        {renderSection()}
      </div>
    </Protect>
  );
};

export default VideoFlowDashboard;
