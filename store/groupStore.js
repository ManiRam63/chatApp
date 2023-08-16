const Group = require("../models/groupModel");
/**
 *
 * @param {*} data
 * @returns object
 * @description:this function is used to create group
 */
const createGroup = async (data) => {
  try {
    const group = new Group(data);
    const response = await group.save();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *@
 */
const getGroups = async (id) => {
  try {
    return await Group.find({ creator_id: id });
  } catch (error) {
    return error.message;
  }
};
module.exports = {
  createGroup,
  getGroups,
};
