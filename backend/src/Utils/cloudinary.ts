import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

type options = {
  resource_type: "image" | "video" | "raw";
  public_id?: string;
  format?: string;
};

export const uploadOnCloudinary = async (localFilePath : string , type: "image" | "video" | "raw" = "video" , public_id?: string , format?: "m3u8" | "ts") => {
  try {
    if (!localFilePath) return null;
    const normalized = localFilePath.replace(/\\/g, "/");

    //upload the file on cloudinary
    console.log("Local file path: " , localFilePath);
    
    const options: options = {
      resource_type: `${type}`
    };

    if(public_id && format) {
      options.public_id = public_id
      options.format = format
    }

    const response = await cloudinary.uploader.upload(normalized, options);
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);

    console.log("file is uploaded on cloudinary" , localFilePath);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {

    fs.unlinkSync(localFilePath);
    return null;

  }
};
