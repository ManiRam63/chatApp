const mongoose = require("mongoose");
const groupSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: new mongoose.Types.ObjectId(),
    },
    creator_id: {
      type: String,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("group", groupSchema);
