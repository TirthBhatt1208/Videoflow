import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});


export const uploadOnCloudinary = async (localFilePath : string) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    //console.log("Local file path: " , localFilePath);
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};
