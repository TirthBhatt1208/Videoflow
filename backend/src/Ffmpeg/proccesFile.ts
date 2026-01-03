import path from "node:path";
import fs from "fs"
import { execSync } from "node:child_process";
const RESOLUTIONS = [
  { name: "240p", height: 240, bitrate: "400k" },
  { name: "360p", height: 360, bitrate: "800k" },
  { name: "480p", height: 480, bitrate: "1400k" },
  { name: "720p", height: 720, bitrate: "2800k" },
  { name: "1080p", height: 1080, bitrate: "5000k" },
];

function getAllowedResolutions(videoHeight: number) {
  return RESOLUTIONS.filter((r) => r.height <= videoHeight);
}

function buildHlsCommand(
  height: number,
  bitrate: string,
  url: string,
  outputDir: string
) {
  const ffmpeg = `
            ffmpeg -y -i "${url}" \
            -vf "scale=-2:${height}" \
            -c:a aac -ar 48000 -c:v h264 -profile:v main \
            -crf 20 -sc_threshold 0 \
            -g 48 -keyint_min 48 \
            -b:v ${bitrate} -maxrate ${bitrate} -bufsize ${parseInt(bitrate) * 2}k \
            -hls_time 6 -hls_playlist_type vod \
            -hls_segment_filename "${outputDir}/segment_%03d.ts" \
            "${outputDir}/index.m3u8"
            `.trim();

  return ffmpeg;
}

function generateMasterPlaylist(
  baseDir: string,
  resolutions: typeof RESOLUTIONS
) {
  let content = "#EXTM3U\n#EXT-X-VERSION:3\n\n";

  resolutions.forEach((res, index) => {
    content +=
      `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate) * 1000},RESOLUTION=${Math.round((res.height*16) / 9)}x${res.height}v${index}/index.m3u8`.trim() + "\n";
  });

  fs.writeFileSync(path.join(baseDir, "master.m3u8"), content);
}


export const generateProccesFiles = async(height: number , url: string , outputDir: string) => {

    const allowed = getAllowedResolutions(height)

    allowed.forEach((res , idx) => {
        const variantDir = path.join(outputDir, `v${idx}`);
        fs.mkdirSync(variantDir, { recursive: true });

        const cmd = buildHlsCommand(res.height , res.bitrate , url , variantDir);

        execSync(cmd , {stdio: "inherit"});
    })

    generateMasterPlaylist(outputDir , allowed)
}