import React, { useState } from "react";
import {Sidebar , MainContent} from "../Componets/index.ts";
const VideoFlowDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default VideoFlowDashboard;
