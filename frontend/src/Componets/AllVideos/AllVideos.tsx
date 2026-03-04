import React, { useEffect, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import Hls from "hls.js";
import { useRef } from "react";
import { getAllCompletedVideos } from "../../Api/getApis.ts";

interface VideoData {
    id: string;
    title: string | null;
    masterPlaylistUrl: string;
    vttUrl: string | null;
    createdAt: string;
    thumbnail?: { url?: string }[];
    metadata?: { duration?: number | null } | null;
}

interface Pagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// Individual video card with HLS + Plyr (same pattern as Videoplayer component)
function VideoCard({ video }: { video: VideoData }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const plyrRef = useRef<any>(null);
    const hlsRef = useRef<Hls | null>(null);

    const posterUrl = video.thumbnail?.[0]?.url;

    const plyrProps = {
        source: {
            type: "video" as const,
            sources: [
                {
                    src: video.masterPlaylistUrl,
                    type: "application/x-mpegURL",
                },
            ],
            poster: posterUrl,
        },
        options: {
            previewThumbnails: {
                enabled: !!video.vttUrl,
                src: video.vttUrl || "",
            },
            controls: [
                "play",
                "progress",
                "current-time",
                "mute",
                "settings",
                "fullscreen",
            ],
            settings: ["captions", "quality", "speed"],
            speed: { default: 1, selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
            storage: { enabled: true, key: "plyr" },
        },
    };

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl || !plyrRef.current?.plyr) return;

        if (Hls.isSupported()) {
            const hls = new Hls({
                debug: false,
                enableWorker: true,
            });

            hlsRef.current = hls;
            hls.loadSource(video.masterPlaylistUrl);
            hls.attachMedia(videoEl);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                const qualityLevels = hls.levels.map((level) => level.height);

                if (plyrRef.current?.plyr) {
                    plyrRef.current.plyr.quality.options = qualityLevels;
                }
            });

            plyrRef.current.plyr.on("qualitychange", () => {
                console.log("Quality changed");
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
                const level = hls.levels[data.level];
                console.log(`Switched to: ${level.height}p`);
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
            videoEl.src = video.masterPlaylistUrl;
        }
    }, [video.masterPlaylistUrl]);

    // Format duration
    const formatDuration = (seconds?: number | null) => {
        if (!seconds) return "";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
            <div className="w-full aspect-video bg-black rounded-t-xl overflow-hidden">
                <Plyr
                    {...plyrProps}
                    ref={(instance: any) => {
                        plyrRef.current = instance;
                        if (instance?.plyr?.media) {
                            videoRef.current = instance.plyr.media;
                        }
                    }}
                />
            </div>
            <div className="p-4">
                <h4 className="text-white font-medium truncate text-sm">
                    {video.title || "Untitled Video"}
                </h4>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    {video.metadata?.duration && (
                        <span>{formatDuration(video.metadata.duration)}</span>
                    )}
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}

function AllVideos() {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const LIMIT = 10;

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllCompletedVideos(currentPage, LIMIT);
                const data = response.data?.data;
                setVideos(data?.videos || []);
                setPagination(data?.pagination || null);
            } catch (err) {
                console.error("Failed to fetch all videos:", err);
                setError("Failed to load videos");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [currentPage]);

    const handlePrevPage = () => {
        if (pagination?.hasPrev) {
            setCurrentPage((p) => p - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination?.hasNext) {
            setCurrentPage((p) => p + 1);
        }
    };

    return (
        <div className="flex-1 overflow-auto p-6 bg-gray-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Film className="w-7 h-7 text-blue-400" />
                        All Videos
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {pagination
                            ? `${pagination.totalCount} completed video${pagination.totalCount !== 1 ? "s" : ""}`
                            : "Loading..."}
                    </p>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <span className="ml-3 text-gray-400">Loading videos...</span>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-400">{error}</div>
            ) : videos.length === 0 ? (
                <div className="text-center py-20">
                    <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No completed videos found</p>
                </div>
            ) : (
                <>
                    {/* Video Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={handlePrevPage}
                                disabled={!pagination.hasPrev}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.hasPrev
                                    ? "bg-gray-800 text-white hover:bg-gray-700"
                                    : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter((page) => {
                                        // Show first, last, current, and adjacent pages
                                        return (
                                            page === 1 ||
                                            page === pagination.totalPages ||
                                            Math.abs(page - currentPage) <= 1
                                        );
                                    })
                                    .map((page, idx, arr) => (
                                        <React.Fragment key={page}>
                                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                                                <span className="text-gray-500 px-1">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={!pagination.hasNext}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.hasNext
                                    ? "bg-gray-800 text-white hover:bg-gray-700"
                                    : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AllVideos;
