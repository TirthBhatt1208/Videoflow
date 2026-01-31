import { io } from "socket.io-client";
import { uploadVideoProcessing } from "../Store/store";
console.log("CORS ORIGIN:", import.meta.env.VITE_CORS_ORIGIN);
export const socket = io(import.meta.env.VITE_CORS_ORIGIN, {
  autoConnect: false,
});

socket.on("connect" , () => {
  console.log("Web Socket is conneted" , socket.id)
});
socket.on("progress" , (data) => {
  uploadVideoProcessing.getState().setProgress(data.progress);
  uploadVideoProcessing.getState().setStatus(data.status);
})