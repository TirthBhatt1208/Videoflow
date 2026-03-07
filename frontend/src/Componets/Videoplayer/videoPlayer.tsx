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
        startLevel: -1,
        abrEwmaDefaultEstimate: 5000000,
        abrEwmaFastLive: 3.0,
        abrEwmaSlowLive: 9.0,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const availableQualities = hls.levels.map((l) => l.height);

        // Plyr ko batao via config, not direct assignment
        const plyr = plyrRef.current?.plyr;
        if (!plyr) return;

        // Plyr custom quality event override
        plyr.on("qualitychange", (event: any) => {
          const quality = event.detail.quality;
          if (quality === 0) {
            hls.currentLevel = -1; // Auto
          } else {
            hls.currentLevel = hls.levels.findIndex((l) => l.height === quality);
          }
        });
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
