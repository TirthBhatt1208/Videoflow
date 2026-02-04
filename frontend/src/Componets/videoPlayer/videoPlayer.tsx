import {Plyr} from "plyr-react";
import "plyr-react/plyr.css";

type Props = {
  url: string;
    thumbnailVttUrl?: string;
  poster?: string;
};

function Videoplayer({ url, poster, thumbnailVttUrl }: Props) {
  const plyrProps = {
    source: {
      type: "video" as const,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL", // agar m3u8 ho to application/x-mpegURL
        },
      ],
      poster: poster,
    },
    options: {
      previewThumbnails: {
        enabled: true,
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
    },
  };

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <Plyr {...plyrProps} />
    </div>
  );
}

export default Videoplayer;
