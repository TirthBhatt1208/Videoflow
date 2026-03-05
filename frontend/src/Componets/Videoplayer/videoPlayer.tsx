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
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
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
        startLevel: -1, // Start in Auto mode — let ABR pick based on network speed
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Available levels:", hls.levels);

        // Extract available quality heights and prepend 0 (Auto)
        const qualityLevels = hls.levels.map((level) => level.height);
        const qualityOptions = [0, ...qualityLevels]; // 0 = Auto

        // Update Plyr quality options with Auto included
        const plyr = plyrRef.current?.plyr;
        if (plyr) {
          plyr.quality = {
            default: 0, // Default to Auto
            options: qualityOptions,
            forced: true,
            onChange: (quality: number) => {
              if (quality === 0) {
                // Auto mode — let HLS.js decide based on network speed
                hls.currentLevel = -1;
                console.log("Quality set to Auto (ABR)");
              } else {
                // Find the HLS level matching the selected height
                const levelIndex = hls.levels.findIndex(
                  (level) => level.height === quality
                );
                if (levelIndex !== -1) {
                  hls.currentLevel = levelIndex;
                  console.log(`Quality forced to ${quality}p (level ${levelIndex})`);
                }
              }
            },
          };

          // Override the quality label so "0" shows as "Auto"
          plyr.i18n = {
            ...plyr.i18n,
            qualityLabel: {
              0: "Auto",
            },
          };

          console.log("Quality options added:", qualityOptions);
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const level = hls.levels[data.level];
        console.log(`ABR switched to: ${level.height}p`);
      });

      // Error handling
      hls.on(Hls.Events.ERROR, (_event, data) => {
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
