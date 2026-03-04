import React from "react";
import {
  Pause,
  X,
  CheckCircle,
  AlertCircle,
  FileVideo,
} from "lucide-react";
import { uploadVideoProcessing } from "../../Store/store.ts";

// Helper to create a human-readable label from status
function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ActiveUpload() {
  const { videos, removeVideo } = uploadVideoProcessing();

  if (videos.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Active Uploads</h3>
          <span className="text-sm text-slate-500">No active uploads</span>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <FileVideo className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            Upload a video to see it here
          </p>
        </div>
      </div>
    );
  }

  const uploadingCount = videos.filter(
    (v) => v.status !== "COMPLETED" && v.status !== "FAILED"
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Active Uploads</h3>
        <span className="text-sm text-slate-500">
          {uploadingCount > 0
            ? `Uploading ${uploadingCount} of ${videos.length} file${videos.length > 1 ? "s" : ""}`
            : `${videos.length} file${videos.length > 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="space-y-3">
        {videos.map((file) => {
          const isUploading =
            file.status !== "COMPLETED" && file.status !== "FAILED";
          const isComplete = file.status === "COMPLETED";
          const isFailed = file.status === "FAILED";

          return (
            <div
              key={file.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail placeholder */}
                <div className="relative w-24 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <FileVideo className="w-8 h-8 text-blue-400" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate mb-1">
                        {file.fileName}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{formatStatus(file.status)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {isUploading && (
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <Pause className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => removeVideo(file.id)}
                      >
                        <X className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar for uploading/processing */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-600 font-medium">
                          {formatStatus(file.status)}...
                        </span>
                        <span className="text-slate-500">
                          {file.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Complete status */}
                  {isComplete && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Upload Complete</span>
                      </div>
                    </div>
                  )}

                  {/* Failed status */}
                  {isFailed && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Upload Failed</span>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveUpload;