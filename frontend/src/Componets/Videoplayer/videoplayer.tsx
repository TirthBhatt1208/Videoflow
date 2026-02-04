import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import QualitySelector from "../QualitySelector"; // ✅ Import custom selector

if (typeof window !== "undefined") {
  (window as any).videojs = videojs;
}

function Videoplayer(props: any) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current!.appendChild(videoElement);

      const enhancedOptions = {
        ...options,
        html5: {
          vhs: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
            limitRenditionByPlayerDimensions: true,
          },
        },
      };

      const player = (playerRef.current = videojs(
        videoElement,
        enhancedOptions,
        () => {
          console.log("✅ Player is ready");
          setPlayerReady(true); // ✅ Enable quality selector

          const qualityLevels = player.qualityLevels();

          qualityLevels.on("addqualitylevel", (event) => {
            console.log(
              "➕ Quality level added:",
              event.qualityLevel.height + "p",
            );
          });

          qualityLevels.on("change", () => {
            const selected = qualityLevels[qualityLevels.selectedIndex];
            if (selected) {
              console.log(`🎯 Quality changed to: ${selected.height}p`);
            }
          });

          onReady && onReady(player);
        },
      ));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      data-vjs-player
      className="w-full aspect-video bg-black rounded-lg overflow-visible shadow relative"
    >
      <div ref={videoRef} />

      {/* ✅ Custom Quality Selector Overlay */}
      {playerReady && playerRef.current && (
        <QualitySelector player={playerRef.current} />
      )}
    </div>
  );
}

export default Videoplayer;
