import React, { useEffect, useState } from "react";
import {videoUploding} from "../../Store/store"
import NoVideoUploading from "./NoUploading";

function UploadProccesing() {
  const [uploadProgress, setUploadProgress] = useState({
    fileName: "marketing_campaign_final_v2.mp4",
    fileSize: "2.4 GB",
    progress: 68,
    timeRemaining: "3 minutes remaining",
    uploadSpeed: "10 MB/s",
  });
  const {isUploading} = videoUploding()

  const [showNetworkWarning, setShowNetworkWarning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return {
          ...prev,
          progress: Math.min(prev.progress + 1, 100),
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleCancelUpload = () => {
    console.log("Upload cancelled");
  };

  const handleMinimize = () => {
    console.log("Minimized to background");
  };

  if(!isUploading) return <NoVideoUploading/>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {showNetworkWarning && (
        <div className="fixed top-6 right-6 bg-white rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm z-50 animate-slideIn">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              Network Stability
            </h4>
            <p className="text-gray-600 text-xs mt-0.5">
              Upload speed fluctuating slightly
            </p>
          </div>
          <button
            onClick={() => setShowNetworkWarning(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Uploading Your Video...
          </h1>
          <p className="text-gray-600">Please do not close this window.</p>
        </div>

        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {uploadProgress.fileName}
            </h3>
            <p className="text-sm text-gray-600">
              {uploadProgress.fileSize} • MP4 Video
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-emerald-500 animate-spin-slow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                Processing
              </span>
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {uploadProgress.progress}%
            </span>
          </div>

          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${uploadProgress.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{uploadProgress.timeRemaining}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{uploadProgress.uploadSpeed}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCancelUpload}
            className="w-full py-3 px-6 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            Cancel Upload
          </button>
          <button
            onClick={handleMinimize}
            className="w-full text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Minimize to background
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Video processing will begin automatically once the upload is complete.
        </p>
      </div>
    </div>
  );
}

export default UploadProccesing;
