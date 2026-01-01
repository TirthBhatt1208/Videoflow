import {exec} from "child_process"
import { ApiError } from "../Utils/apiError.js";
import { ErrorMessage, ErrorStatus } from "../Enums/enums.js";

export const extractMetaData = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const ffmpeg = `ffprobe -v quiet -print_format json -show_format -show_streams "${url}"`;

    exec(ffmpeg, (err, stdout) => {
      if (err) {
        return reject(
          new ApiError(
            ErrorStatus.metadataFfmpegError,
            ErrorMessage.metadataFfmpegError_501
          )
        );
      }

      try {
        const raw = JSON.parse(stdout);

        // VIDEO STREAM
        const videoStream = raw.streams?.find(
          (s: any) => s.codec_type === "video"
        );

        // AUDIO STREAM
        const audioStream = raw.streams?.find(
          (s: any) => s.codec_type === "audio"
        );

        // FPS extraction (avg_frame_rate = "30/1")
        let fps = null;
        if (
          videoStream?.avg_frame_rate &&
          videoStream.avg_frame_rate !== "0/0"
        ) {
          try {
            fps = eval(videoStream.avg_frame_rate); // "30/1" → 30
          } catch {
            fps = null;
          }
        }

        const metaData = {
          duration: raw.format?.duration ? Number(raw.format.duration) : null,
          width: videoStream?.width ?? null,
          height: videoStream?.height ?? null,
          fps,
          codec: videoStream?.codec_name ?? null,
          audioCodec: audioStream?.codec_name ?? null,
          bitrate: raw.format?.bit_rate ? Number(raw.format.bit_rate) : null,
        };
        resolve(metaData);
      } catch (parseError) {
        reject(
          new ApiError(
            ErrorStatus.metadataFfmpegError,
            "Failed to parse metadata JSON"
          )
        );
      }
    });
  });
};
