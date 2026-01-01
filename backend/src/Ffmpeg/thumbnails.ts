import { exec } from "node:child_process"
import dotenv from "dotenv";
dotenv.config();

export const generateThumbnails = async(url: string , outputPath: string) => {

    return new Promise((resolve , reject) => {
        const ffmpeg = `ffmpeg -i "${url}" -vf "fps=1/2" "${outputPath}/thumb_%04d.png"`;
        console.log("Thumbnails generated");

        exec(ffmpeg, (err) => {
          if (err) {
            console.error("Thumbnails generation ffmpeg error: ", err);
            return reject(err)
          }

          return resolve(true)
        });
    })
}