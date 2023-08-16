const User = require("../models/userModels");

/**
 *@
 */
const getUsers = async (id) => {
  try {
    return await User.find({ _id: { $ne: id } });
  } catch (error) {
    return error.message;
  }
};
/**
 * @param {email}
 * @description: this function is used to find user by email id
 * @returns true , false
 */
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    return error.message;
  }
};
module.exports = {
  getUsers,
  findUserByEmail,
};
