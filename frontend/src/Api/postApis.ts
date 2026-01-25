import axios from "axios";

const uploadVideosApi = async(formData: FormData) => {
  const response = await axios.post("/api/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export default uploadVideosApi;