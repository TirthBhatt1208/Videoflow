import React, { useState, useMemo } from "react";
import { videoUploding, uploadVideoProcessing } from "../../Store/store";
import NoVideoUploading from "./NoUploading";

function UploadProccesing() {
  const { isUploading } = videoUploding();
  const { status, progress, fileName } = uploadVideoProcessing();
  const [showNetworkWarning, setShowNetworkWarning] = useState(true);

  // Use useMemo to calculate derived values (optional optimization)
  const uploadProgress = useMemo(
    () => ({
      fileName: fileName || "marketing_campaign_final_v2.mp4",
      fileSize: "2.4 GB",
      progress: progress ,
      timeRemaining: "3 minutes remaining",
      uploadSpeed: "10 MB/s",
    }),
    [fileName, progress],
  );

  const handleCancelUpload = () => {
    console.log("Upload cancelled");
  };

  const handleMinimize = () => {
    console.log("Minimized to background");
  };

  if (!isUploading) return <NoVideoUploading />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {showNetworkWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <svg
            className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800">Network Stability</h4>
            <p className="text-sm text-yellow-700">
              Upload speed fluctuating slightly
            </p>
          </div>
          <button
            onClick={() => setShowNetworkWarning(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Uploading Your Video...
        </h2>
        <p className="text-gray-600">Please do not close this window.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {uploadProgress.fileName}
            </h3>
            <p className="text-sm text-gray-500">
              {uploadProgress.fileSize} • MP4 Video
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{status}</span>
            <span className="text-sm font-medium text-gray-900">
              {uploadProgress.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>{uploadProgress.timeRemaining}</span>
            <span>{uploadProgress.uploadSpeed}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleCancelUpload}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel Upload
          </button>
          <button
            onClick={handleMinimize}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Minimize to background
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center pt-2">
          Video processing will begin automatically once the upload is complete.
        </p>
      </div>
    </div>
  );
}

export default UploadProccesing;
