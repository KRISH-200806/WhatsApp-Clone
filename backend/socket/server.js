const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 🟢 Store online users { userId: socketId }
const userSocketMap = {};

// ✅ Function to get receiver's socket ID
function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

// 🔹 Socket.io Connection
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  // ✅ Store userId with their socket ID
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("Updated online users:", userSocketMap);
  }

  // 🟢 Emit updated online users list
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  // 🟡 Handle user typing event
  socket.on("userTyping", ({ senderId, receiverId, isTyping }) => {
    console.log(`✍️ User ${senderId} is typing for ${receiverId}:`, isTyping);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("showTyping", { senderId, isTyping });
    }
  });

  // 🔴 Handle user disconnecting
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log("Updated online users after disconnect:", userSocketMap);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server, getReceiverSocketId };
