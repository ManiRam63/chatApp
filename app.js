require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/chatApp");
const app = require("express")();
const express = require("express");
const http = require("http").Server(app);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const io = require("socket.io")(http);
const nameSpace = io.of("/chat-namespace");
const UserStore = require("./store/userStore");
const ChatStore = require("./store/chatStore");

// this is used only for stranger chat
app.get("/strangerChat", (req, res) => {
  res.redirect("/strangerChat.html");
});
io.on("connection", (socketStr) => {
  socketStr.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socketStr.on("disconnect", (data) => {});
});
nameSpace.on("connection", async function (socket) {
  const userId = socket?.handshake?.auth?.token;
  await UserStore.findByIdAndUpdate(userId, {
    is_online: "1",
  });
  // broadcast user is online
  socket.broadcast.emit("getUserOnline", { user_id: userId });

  // Disconnect listener
  socket.on("disconnect", async function () {
    await UserStore.findByIdAndUpdate(userId, {
      is_online: "0",
    });
    socket.broadcast.emit("getUserOffline", { user_id: userId });
  });
  socket.on("newChat", function (data) {
    socket.broadcast.emit("loadChat", data);
  });

  // load old chat users
  socket.on("existChat", async function (data) {
    const { senderId, receiverId } = data;
    const oldChatData = await ChatStore.findChat(senderId, receiverId);
    socket.emit("loadChats", { chats: oldChatData });
  });
});
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);
http.listen(3000, function () {
  console.log("server is running.....");
});
