import {useState} from 'react'
import {
  Pause,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  duration: string;
  thumbnail: string;
  status: "uploading" | "complete" | "failed";
  progress?: number;
  uploadSpeed?: string;
  timeLeft?: string;
  errorMessage?: string;
}
function ActiveUpload() {
     const [files, setFiles] = useState<UploadFile[]>([
        {
          id: "1",
          name: "Nature_Documentary_v2.mp4",
          size: 2.4,
          duration: "05:32",
          thumbnail:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
          status: "uploading",
          progress: 45,
          uploadSpeed: "15 MB/s",
          timeLeft: "2 mins left",
        },
        {
          id: "2",
          name: "City_Timelapse_4K.mov",
          size: 3.2,
          duration: "03:45",
          thumbnail:
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop",
          status: "complete",
        },
        {
          id: "3",
          name: "Unsupported_File.exe",
          size: 0.5,
          duration: "",
          thumbnail: "",
          status: "failed",
          errorMessage: "Unsupported format",
        },
      ]);
      const formatFileSize = (gb: number) => `${gb} GB`;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Active Uploads</h3>
        <span className="text-sm text-slate-500">Uploading 1 of 2 files</span>
      </div>

      <div className="space-y-3">
        {files.map((file: UploadFile) => (
          <div
            key={file.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate mb-1">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.duration && (
                        <>
                          <span>•</span>
                          <span>{file.duration}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {file.status === "uploading" && (
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Pause className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar or Status */}
                {file.status === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 font-medium">
                        Uploading...
                      </span>
                      <span className="text-slate-500">
                        {file.progress}% • {file.uploadSpeed} • {file.timeLeft}
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

                {file.status === "complete" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Upload Complete</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Video
                    </button>
                  </div>
                )}

                {file.status === "failed" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">
                        Upload Failed: {file.errorMessage}
                      </span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveUpload