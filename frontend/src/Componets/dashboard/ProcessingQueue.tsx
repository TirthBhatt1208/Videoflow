import React, { useEffect, useState } from "react";
import { uploadVideoProcessing } from "../../Store/store.ts";
import { getProcessingQueue } from "../../Api/getApis.ts";
import { X, Loader2, ChevronDown } from "lucide-react";

interface ProcessingVideo {
  id: string;
  fileName: string;
  progress: number;
  status: string;
}

// Helper to create a human-readable label from the Prisma enum status
function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const PAGE_SIZE = 5;

function ProcessingQueue() {
  const { videos: storeVideos, removeVideo } = uploadVideoProcessing();
  const [backendVideos, setBackendVideos] = useState<ProcessingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchProcessingQueue = async () => {
      try {
        setLoading(true);
        const response = await getProcessingQueue();
        const data: ProcessingVideo[] =
          response.data?.data?.processingVideos || [];
        setBackendVideos(data);
      } catch (err) {
        console.error("Failed to fetch processing queue:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingQueue();
  }, []);

  // Merge: storeVideos take priority (live updates via websocket/upload flow),
  // then append any backend videos that don't already exist in the store
  const mergedVideos: ProcessingVideo[] = [
    ...storeVideos.map((v) => ({
      id: v.id,
      fileName: v.fileName,
      progress: v.progress,
      status: v.status,
    })),
    ...backendVideos.filter(
      (bv) => !storeVideos.some((sv) => sv.id === bv.id)
    ),
  ];

  const activeCount = mergedVideos.length;
  const visibleVideos = mergedVideos.slice(0, visibleCount);
  const hasMore = visibleCount < mergedVideos.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Processing Queue</h2>
          <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
            {activeCount} Active
          </span>
        </div>
      </div>
      <div className="p-6">
        {loading && backendVideos.length === 0 && storeVideos.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          </div>
        ) : mergedVideos.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-400">
            No active processing jobs
          </div>
        ) : (
          <div className="space-y-4">
            {visibleVideos.map((job) => (
              <div key={job.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {job.fileName}
                  </span>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => removeVideo(job.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {formatStatus(job.status)}...
                  </span>
                  <span className="text-gray-400">{job.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <button
            onClick={handleShowMore}
            className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <ChevronDown className="w-4 h-4" />
            Show more ({mergedVideos.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </div>
  );
}

export default ProcessingQueue;