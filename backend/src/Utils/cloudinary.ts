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
  overwrite?: boolean;
  invalidate?: boolean;
  access_mode?: string; 
};

export const uploadOnCloudinary = async (
  localFilePath: string,
  type: "image" | "video" | "raw" = "video",
  public_id?: string,
  format?: "m3u8" | "ts",
) => {
  try {
    if (!localFilePath) return null;
    const normalized = localFilePath.replace(/\\/g, "/");

    console.log("📤 Uploading:", localFilePath);
    if (public_id) console.log("📍 Public ID:", public_id);

    let resourceType = type;
    if (format === "m3u8" || localFilePath.endsWith(".m3u8")) {
      resourceType = "raw";
      console.log("🔄 Detected M3U8 file, using resource_type: 'raw'");
    }

    const options: options = {
      resource_type: resourceType, 
      overwrite: true,
      invalidate: true,
    };

    if (public_id) {
      options.public_id = public_id;
    }

    if (format && resourceType === "raw") {
      options.format = format;
      options.access_mode = "public";
    }

    const response = await cloudinary.uploader.upload(normalized, options);

    console.log("✅ Uploaded:", localFilePath);
    console.log("   URL:", response.secure_url);
    console.log("   Public ID:", response.public_id);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};
