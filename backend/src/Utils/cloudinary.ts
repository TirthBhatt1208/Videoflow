import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});


export const uploadOnCloudinary = async (localFilePath : string , type: "image" | "video" = "video") => {
  try {
    if (!localFilePath) return null;
    const normalized = localFilePath.replace(/\\/g, "/");
    //upload the file on cloudinary
    console.log("Local file path: " , localFilePath);
    
    const response = await cloudinary.uploader.upload(normalized, {
      resource_type: `${type}`,
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    console.log("file is uploaded on cloudinary" , localFilePath);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};
