const mongoose = require("mongoose");
const chatSchema = mongoose.Schema(
  {
    sender_id: {
      type: String,
      ref: "user",
    },
    receiver_id: {
      type: String,
      ref: "user",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);
