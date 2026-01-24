import axios from "axios";


async function uploadVideos(files: File[]) {
  try {
    const formData = new FormData()
    
    files.forEach((file) => {
      formData.append("videos", file);
    });
    
    console.log("📦 FormData entries:", Array.from(formData.entries()));
    
    const response = await axios.post("/api/videos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

export default uploadVideos