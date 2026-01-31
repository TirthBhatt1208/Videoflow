import uploadVideosApi from "../Api/postApis";
import { socket } from "../Sockets/sockets";
//import {socket} from "../Sockets/sockets"

async function uploadVideos(
  files: File[],
  setStatus: (newStatus: string) => void,
  setProgress: (newProgress: number) => void,
  setFileName: (newFileName: string) => void,
) {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("videos", file);
    });

    
    //console.log("index: ", files[idx].name);

    console.log("📦 FormData entries:", Array.from(formData.entries()));
    const response = await uploadVideosApi(formData);
    console.log(response);
    const data = response.data.data!;

    if (!data) {
      console.error("Internal server error!!!");
      return;
    }

    socket.connect()
    socket.on("connect", () => {
      let idx = 0;
      for (const val of data) {
        const { status, progress } = val;
        setStatus(status);
        setProgress(Number(progress));
        setFileName(files[idx].name);
        idx++;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default uploadVideos;
