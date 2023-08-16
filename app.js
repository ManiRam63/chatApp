require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/chatApp");
const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
const io = require("socket.io")(http);
const nameSpace = io.of("/chat-namespace");
const User = require("./models/userModels");
const Chat = require("./models/chatModel");
nameSpace.on("connection", async function (socket) {
  const userId = socket?.handshake?.auth?.token;
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        is_online: "1",
      },
    }
  );
  // broadcast user is online
  socket.broadcast.emit("getUserOnline", { user_id: userId });
  // Disconnect listener
  socket.on("disconnect", async function () {
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          is_online: "0",
        },
      }
    );
    socket.broadcast.emit("getUserOffline", { user_id: userId });
  });
  socket.on("newChat", function (data) {
    socket.broadcast.emit("loadChat", data);
  });
  // load old chat users
  socket.on("existChat", async function (data) {
    const { senderId, receiverId } = data;
    const oldChatData = await Chat.find({
      $or: [
        {
          sender_id: senderId,
          receiver_id: receiverId,
        },
        {
          sender_id: receiverId,
          receiver_id: senderId,
        },
      ],
    });

    socket.emit("loadChats", { chats: oldChatData });
  });
});
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);
http.listen(3000, function () {
  console.log("server is running.....");
});
