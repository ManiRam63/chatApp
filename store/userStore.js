const User = require("../models/userModels");

/**
 * @param : id
 * @description : this function is used to get user
 */
const getUsers = async (id) => {
  try {
    return await User.find({ _id: { $ne: id } });
  } catch (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};

/**
 * @param {email}
 * @description: this function is used to find user by email id
 * @returns true , false
 */
const findByIdAndUpdate = async (id, attribute) => {
  try {
    return await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: attribute,
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @param {email}
 * @description: this function is used to create new users
 * @returns {}
 */
const createUser = async (data, filename) => {
  try {
    const { name, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: email,
      image: "/images/" + filename,
      password: hashPassword,
    });
    return await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getUsers,
  createUser,
  findUserByEmail,
  findByIdAndUpdate,
};
