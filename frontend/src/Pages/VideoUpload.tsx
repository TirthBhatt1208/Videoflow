import React, { useState } from "react";
import Setting from "../Componets/videoUpload/Setting";
import Header from "../Componets/dashboard/Header";
import MainUpload from "../Componets/videoUpload/MainUpload";
import { UploadVideo } from "../Data/videoUpload";
import type { UploadFile } from "../Types/videoUpload";

const VideoUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);

  React.useEffect(() => {
    setFiles(UploadVideo);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <Header />

      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <MainUpload />

          {/* Settings Sidebar */}
          <Setting files={files} />
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
