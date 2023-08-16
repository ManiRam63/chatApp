const Chat = require("../models/chatModel");

const deleteChat = async (id) => {
  try {
    return await Chat.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  deleteChat,
};
