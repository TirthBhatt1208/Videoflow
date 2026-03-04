import React from "react";
import Header from "../Componets/dashboard/Header";
import MainUpload from "../Componets/videoUpload/MainUpload";

const VideoUpload: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <Header />

      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        {/* Main Upload Area */}
        <MainUpload />
      </div>
    </div>
  );
};

export default VideoUpload;

