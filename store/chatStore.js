const Chat = require("../models/chatModel");
/**
 * @param {*} id
 * @returns
 * @description :this function is used to delete chat
 */
const deleteChat = async (id) => {
  try {
    return await Chat.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @param {*} id
 * @returns
 * @description :this function is used to find chat records of old data
 */
const findChat = async (senderId, receiverId) => {
  try {
    return await Chat.find({
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
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @param {*} data
 * @returns
 * @description :this function is used to save chat records
 */
const saveChat = async (data) => {
  try {
    const { senderId, recieverId, message } = data;
    const chat = new Chat({
      receiver_id: recieverId,
      sender_id: senderId,
      message: message,
    });
    return await chat.save();
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  deleteChat,
  findChat,
  saveChat,
};
