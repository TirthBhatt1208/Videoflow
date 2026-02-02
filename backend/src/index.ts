import dotenv from 'dotenv';
dotenv.config({path: "./.env"});
import app from './app.js';
import http from "http"
import { Server } from 'socket.io';
import { subscriber } from "./Workers/redisClient.js";


const Port: number | string = process.env.PORT || 3000;

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  },
});


const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("register" , (userId) => {
    console.log("here userID" , userId)
    userSocketMap.set(userId , socket.id)
  })
  socket.emit("progress" , "hello from socket server");
});

subscriber.subscribe("video-progress", (message) => {

  const { userId, progress, status, videoId } = JSON.parse(message);
  
  console.log("\n\nReaching here in subscriber...\n" , userId , progress , status);

  const socketId = userSocketMap.get(userId);
  if (socketId) {
    console.log("\n\nINSIDE THE IF CONDITION...\n\n");
    console.log("Emitting progress to socket ID:", socketId);
    console.log("Emitting progress to Video ID:", videoId);
    io.to(socketId).emit("progress", { progress, status, videoId });
  }
});

server.listen(Port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});