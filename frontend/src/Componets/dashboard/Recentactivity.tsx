import React, { useEffect, useState } from "react";
import { Video, Loader2, ChevronDown } from "lucide-react";
import { getStatusBadge } from "../../Data/dashboard.ts";
import { getRecentActivity } from "../../Api/getApis.ts";
import { uploadVideoProcessing } from "../../Store/store.ts";
import type { VideoItem } from "../../Types/dashboard.ts";

// Helper to create a human-readable label from the Prisma enum status
function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Generate a deterministic gradient based on the video id
const gradients = [
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-green-500 to-green-700",
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-rose-400 to-rose-600",
  "bg-gradient-to-br from-blue-400 to-blue-600",
];

const PAGE_SIZE = 5;

function Recentactivity() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Get live processing state from zustand store
  const { videos: processingVideos } = uploadVideoProcessing();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const response = await getRecentActivity();
        const data = response.data?.data?.recentVideos || [];
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
        setError("Failed to load recent activity");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  // Merge live processing status from zustand store with backend data
  const mergedVideos = videos.map((video) => {
    const liveVideo = processingVideos.find((pv) => pv.id === video.id);
    if (liveVideo) {
      return {
        ...video,
        status: liveVideo.status as VideoItem["status"],
        progress: liveVideo.progress,
      };
    }
    return video;
  });

  const visibleVideos = mergedVideos.slice(0, visibleCount);
  const hasMore = visibleCount < mergedVideos.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-sm text-red-500">{error}</div>
        ) : mergedVideos.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            No recent videos in the last 24 hours
          </div>
        ) : (
          <div className="space-y-4">
            {visibleVideos.map((video, idx) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`w-20 h-14 ${gradients[idx % gradients.length]} rounded-lg flex items-center justify-center`}
                >
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {video.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {video.size} • {video.format}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                    video.status
                  )}`}
                >
                  {formatStatus(video.status)}
                </span>
                <div className="text-sm text-gray-500 w-20 text-center">
                  {video.duration}
                </div>
                <div className="text-sm text-gray-500 w-24 text-right">
                  {video.uploadedAt}
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

export default Recentactivity;