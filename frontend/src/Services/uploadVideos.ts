import uploadVideosApi from "../Api/postApis";

async function uploadVideos(files: File[]) {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("videos", file);
    });

    console.log("📦 FormData entries:", Array.from(formData.entries()));

    const response = await uploadVideosApi(formData);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

export default uploadVideos;
