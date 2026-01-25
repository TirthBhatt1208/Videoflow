import { io } from "socket.io-client";

console.log("CORS ORIGIN:", import.meta.env.VITE_CORS_ORIGIN);
export const socket = io(import.meta.env.VITE_CORS_ORIGIN, {
  autoConnect: false,
});
