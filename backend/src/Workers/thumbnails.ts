import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { ApiError } from "../Utils/apiError.js";
import { ErrorMessage, ErrorStatus, SuccessMessage } from "../Enums/enums.js";
import { generateThumbnails } from "../Ffmpeg/thumbnails.js";
import path from "node:path";
import fs from "fs"
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { prisma } from "../db/index.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

type thumbnails = {
    videoId: string
    time: number
    url: string
}

const thumbnailsWorker = new Worker("thumbnails" , async (job: Job) => {
    const {videoId , originalUrl} = job.data
    console.log(`videoId: ${videoId} , originalUrl: ${originalUrl}`)

    if(!videoId || !originalUrl) {
        throw new ApiError(ErrorStatus.validationError , ErrorMessage.validationError_422)
    }
    
    const outputPath = path.join(
      process.cwd(),
      "public",
      "thumbnails",
      videoId
    );
    fs.mkdirSync(outputPath, { recursive: true });

    console.log("outputPath: " , outputPath)
    await generateThumbnails(originalUrl , outputPath)
    console.log("reaching here......")

    console.log("REAL OUTPUT PATH:", outputPath);
    console.log("ABSOLUTE PATH EXISTS:", fs.existsSync(outputPath));
    console.log("FILES IN ACTUAL FS:", fs.readdirSync(outputPath));

    console.log(
      "FILES IN /public:",
      fs.readdirSync(path.join(process.cwd(), "public"))
    );
    console.log(
      "FILES IN /public/thumbnails:",
      fs.readdirSync(path.join(process.cwd(), "public", "thumbnails"))
    );


    const files = await (fs.readdirSync(outputPath))
        .filter((f) => { console.log("f: " , f); return f.endsWith(".png")})
        .sort();

    const interval = 2;
    const thumbnails: thumbnails[] = [];
    console.log("files: " , files)

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        console.log("fileName: " , fileName)
        let fullPath = path.join(outputPath, fileName!);
        fullPath = fullPath.replace(/\\/g, "/"); // 👈🏼 make path POSIX
        console.log("Local file path:", fullPath);

        console.log("full path: " , fullPath)
        const upload = await uploadOnCloudinary(fullPath , "image");
        console.log(" transcode upload: " , upload)
        if (!upload) {
            throw new ApiError(
                ErrorStatus.uploadFailedOnCloud,
                ErrorMessage.uploadFailedOnCloud_500
            );
        }
        
        //fs.unlinkSync(fullPath);

      const time = i * interval;

        thumbnails.push({
                videoId,
                url: upload.url,
            time,
        });
    }

    fs.rmSync(outputPath, { recursive: true, force: true });
    
    const dbThumbnails = await prisma.thumbnail.createMany({
        data: thumbnails
    })

    if(!dbThumbnails) {
        throw new ApiError(ErrorStatus.transcodingFailed , ErrorMessage.transcodingFailed_500)
    }

    try {
        await prisma.jobLog.create({
            data: {
                videoId: videoId,
                jobType: "transcode",
                status: "success",
                message: SuccessMessage.transcodingSuccess_200
            }
        })
    } catch (error) {
        console.error(
            `Erorr in job log transcodig... error: ${error}`
        );
        
    }

    try{
        await prisma.video.update({
            where: {
                id: videoId,

            },
            data: {
                status: "TRANSCODED",
                progress: 25
            }
        })
    }catch(error){
        console.error(`Erorr to update trnascoding status in db.... ${error}`)
    }

} , {connection});

thumbnailsWorker.on("completed" , (job) => {
    console.log(`Thumbnails job ${job.id} completed`);
});

thumbnailsWorker.on("failed" , (job , err) => {
    console.error(`Thumbnails job ${job?.id} failed` , err);
});