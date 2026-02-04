import path from "node:path";
import fs from "fs";
import { execSync } from "node:child_process";

const RESOLUTIONS = [
  { name: "240p", height: 240, bitrate: "400k" },
  { name: "360p", height: 360, bitrate: "800k" },
  { name: "480p", height: 480, bitrate: "1500k" },
  { name: "720p", height: 720, bitrate: "5000k" },
  { name: "1080p", height: 1080, bitrate: "8000k" },
];

function getAllowedResolutions(videoHeight: number) {
  return RESOLUTIONS.filter((r) => r.height <= videoHeight);
}

function buildHlsCommand(
  height: number,
  bitrate: string,
  url: string,
  outputDir: string,
) {
  const ffmpeg = `
ffmpeg -y -i "${url}" \
-vf "scale=-2:${height}" \
-c:a aac -ar 48000 -b:a 128k \
-c:v h264 -profile:v main -preset medium \
-b:v ${bitrate} -maxrate ${bitrate} -bufsize ${parseInt(bitrate) * 2}k \
-g 48 -keyint_min 48 -sc_threshold 0 \
-pix_fmt yuv420p \
-hls_time 6 \
-hls_playlist_type vod \
-hls_flags independent_segments \
-hls_segment_type mpegts \
-hls_segment_filename "${outputDir}/segment_%03d.ts" \
"${outputDir}/index.m3u8"`.trim();

  return ffmpeg;
}

function generateMasterPlaylist(
  baseDir: string,
  resolutions: typeof RESOLUTIONS,
) {
  let content = "#EXTM3U\n#EXT-X-VERSION:3\n\n";

  resolutions.forEach((res, index) => {
    const width = Math.round((res.height * 16) / 9);

    content += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate) * 1000},RESOLUTION=${width}x${res.height}\n`;
    content += `v${index}/index.m3u8\n\n`;
  });

  const masterPath = path.join(baseDir, "master.m3u8");
  fs.writeFileSync(masterPath, content);

  console.log("\n=== Generated Master Playlist ===");
  console.log(content);
  console.log(`Saved at: ${masterPath}\n`);
}

export const generateProccesFiles = async (
  height: number,
  url: string,
  outputDir: string,
) => {
  const allowed = getAllowedResolutions(height);

  console.log(`\n=== Generating ${allowed.length} variants ===`);

  allowed.forEach((res, idx) => {
    const variantDir = path.join(outputDir, `v${idx}`);
    fs.mkdirSync(variantDir, { recursive: true });

    const cmd = buildHlsCommand(res.height, res.bitrate, url, variantDir);

    console.log(
      `\nGenerating ${res.name} (v${idx}) - ${res.height}p @ ${res.bitrate}...`,
    );
    execSync(cmd, { stdio: "inherit" });
    const data = fs.readFileSync(`${variantDir}/index.m3u8`, "utf8");
    console.log(`\n=== ${res.name} Playlist ===`);
    console.log(data);
    console.log(`✓ ${res.name} completed`);
  });

  generateMasterPlaylist(outputDir, allowed);

  console.log("=== All variants generated successfully ===\n");
};
