const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: new mongoose.Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    is_online: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
