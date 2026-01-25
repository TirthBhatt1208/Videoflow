import dotenv from 'dotenv';
dotenv.config({path: "./.env"});
import app from './app.js';
import http from "http"
import { Server } from 'socket.io';


const Port: number | string = process.env.PORT || 3000;

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(Port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});