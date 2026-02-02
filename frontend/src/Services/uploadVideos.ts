import uploadVideosApi from "../Api/postApis";
import { socket } from "../Sockets/sockets";
import { uploadVideoProcessing , /*videoUploding*/ } from "../Store/store";

async function uploadVideos(files: File[], userId: string) {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("videos", file);
    });

    const { updateVideo } = uploadVideoProcessing.getState();
    let completedVideos = 0;
    // CONNECT
    socket.connect();

    socket.off("connect");
    socket.on("connect", () => {
      socket.emit("register", userId);
    });

    // SOCKET PROGRESS
    socket.off("progress");
    socket.on("progress", (data) => {
      console.log("Progress data received:", data);

      if (data.videoId === undefined || data.videoId === null) {
        console.warn("videoId missing, skipping event");
        return;
      }
      updateVideo(data.videoId.toString(), {
        progress: data.progress,
        status: data.status,
      });

      if (data.status.toLowerCase() === "completed") {
        console.log("Video completed:", data.videoId);
        completedVideos += 1;

        // If all videos are completed, disconnect the socket
        if (completedVideos === files.length) {
          console.log("All videos uploaded, disconnecting socket.");
          socket.disconnect();
        }
      }
    });

    const response = await uploadVideosApi(formData);

    if (!response.data.data) {
      console.error("Upload failed");
      socket.disconnect();
      return;
    }

    // After upload mark all videos UPLOADED 20%
    files.forEach((_, index) => {
      updateVideo(index.toString(), {
        progress: 20,
        status: "UPLOADED",
      });
    });

    socket.on("disconnect", () => {
      //videoUploding.getState().setIsUploading();
      console.log("Socket disconnected");
    });
  } catch (err) {
    console.error(err);
  }
}

export default uploadVideos;
