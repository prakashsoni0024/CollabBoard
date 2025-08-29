const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store drawing history per room
const rooms = {}; // example: { roomId1: [...drawings], roomId2: [...drawings] }

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📥 ${socket.id} joined room ${roomId}`);

    // If room history exists, send it
    if (!rooms[roomId]) rooms[roomId] = [];

    socket.emit("initBoard", rooms[roomId]);

    // Room-specific draw
    socket.on("draw", (data) => {
      rooms[roomId].push(data);
      socket.to(roomId).emit("draw", data); // only to others in same room
    });

    // Room-specific clear
    socket.on("clear", () => {
      rooms[roomId] = [];
      io.to(roomId).emit("clear");
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
