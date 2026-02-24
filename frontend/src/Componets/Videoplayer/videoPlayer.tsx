import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

type Props = {
  url: string;
  thumbnailVttUrl?: string;
  poster?: string;
};

function Videoplayer({ url, poster, thumbnailVttUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const plyrRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);

  const plyrProps = {
    source: {
      type: "video" as const,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
      poster: poster,
    },
    options: {
      previewThumbnails: {
        enabled: !!thumbnailVttUrl,
        src: thumbnailVttUrl,
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
      speed: { default: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      storage: { enabled: true, key: "plyr" },
    },
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !plyrRef.current?.plyr) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Available levels:", hls.levels);

        // Create quality options
        const qualityLevels = hls.levels.map((level) => level.height);

        // Update Plyr quality options
        if (plyrRef.current?.plyr) {
          plyrRef.current.plyr.quality.options = qualityLevels;
          console.log("Quality options added:", qualityLevels);
        }
      });

      // Handle quality change
      plyrRef.current.plyr.on("qualitychange", () => {
        console.log("Quality changed");
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        console.log(`Switched to: ${level.height}p`);
      });

      // Error handling
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error:", data.details);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error:", data.details);
              hls.recoverMediaError();
              break;
            default:
              console.error("HLS error:", data);
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = url;
      console.log("Using native HLS support (Safari)");
    }
  }, [url]);

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
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
  );
}

export default Videoplayer;
