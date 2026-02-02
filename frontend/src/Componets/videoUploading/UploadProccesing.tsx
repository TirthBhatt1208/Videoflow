import { videoUploding,uploadVideoProcessing  } from "../../Store/store";
import NoVideoUploading from "./NoUploading";

function UploadProccesing() {
  //const { isUploading } = videoUploding();
  const { videos} = uploadVideoProcessing();
  const { isUploading } = videoUploding();

  if (!isUploading) return <NoVideoUploading />;

  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-900 truncate">
                {video.fileName}
              </h3>
              <p className="text-xs text-gray-500">MP4 Video</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="uppercase text-gray-600">{video.status}</span>
              <span>{video.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className={`h-2 rounded transition-all ${
                  video.progress === 100 ? "bg-green-600" : "bg-blue-600"
                }`}
                style={{ width: `${video.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UploadProccesing;
