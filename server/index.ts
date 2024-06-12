import { Application } from "express";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

const express = require("express");
const app: Application = express();
const http = require("http"); //we need this to build our server together with socket.io
const cors = require("cors"); //socket.io deals with a lot of cors issues
const { Server } = require("socket.io");
app.use(cors());

const server: HttpServer = http.createServer(app); //generates a server
const io: SocketIOServer = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //which url/server is gonna do the calling to socket.io server, we tell socket.io it is okay to accept communicatopn with this url
    methods: ["GET", "POST"], //which methods we accept
  },
}); //connect socket.io server with express one

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`); //whenever someone opens and connect, we'll see

  socket.on("join_room", (data: any) => {
    socket.join(data);
    console.log(`User with ${socket.id} joined room! :${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
}); //we are listening for the event

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
