const User = require("../models/userModels");
const UserStore = require("../store/userStore");
const ChatStore = require("../store/chatStore");
const bcrypt = require("bcrypt");

/**
 *
 * @param {*} req
 * @param {*} res
 * @description:this function is used to load register page
 */
const registerLoad = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
/**
 * @param {} req
 * @description:this function is used to register user
 * @returns {message}
 */
const register = async (req, res) => {
  try {
    const { email } = req.body;
    const isExit = await UserStore.findUserByEmail(email);
    if (isExit) {
      throw new Error("Email is already exist");
    }

    await UserStore.createUser(req.body, req.file.filename);
    res.redirect("/");
  } catch (error) {
    res
      .status(400)
      .render("register", { success: false, registerMessage: error?.message });
  }
};
/**
 * @param {} req
 * @description:this function is used load login page
 * @returns {message}
 */
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

/**
 * @param {} req
 * @description:this function is used  login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.findOne({ email: email })
      .exec()
      .then(async (userData) => {
        const passwordMatch = await bcrypt.compare(
          password,
          userData?.password
        );
        if (!passwordMatch) {
          throw new Error("Email and password is incorrect!");
        }

        req.session.user = userData;
        res.cookie(`user`, JSON.stringify(userData));
        res.redirect("/dashboard");
      });
  } catch (error) {
    res
      .status(400)
      .render("login", { success: false, message: error?.message });
  }
};
/**
 * @param {} res
 * @description:this function is used  logout the user
 */
const logout = async (req, res) => {
  try {
    res.clearCookie("user");
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
/**s
 * @param {} res
 * @description:this function is used  login user
 */
const dashboard = async (req, res) => {
  try {
    const { _id } = req.session.user;
    const users = await UserStore.getUsers(_id);
    res.render("dashboard", { user: req.session.user, users: users });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
/**
 * @param {} res
 * @description:this function is used to save chat in db
 */
const saveChat = async (req, res) => {
  try {
    const result = await ChatStore.saveChat(req.body);
    res
      .status(201)
      .send({ success: true, msg: "chat saved successfully", data: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

/**
 * @param { id }
 * @description:this function is used to delete chat from db
 */
const deleteChat = async (req, res) => {
  try {
    await ChatStore.deleteChat(req.body.id);
    res.status(201).send({ success: true, msg: "chat delete successfully" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};
//TODO:we can use this later if group chat will enable
// /**
//  * @param { id }
//  * @description:this function is used to delete chat from db
//  */
// const loadGroup = async (req, res) => {
//   try {
//     const { _id } = req.session.user;
//     const groups = await GroupStore.getGroups(_id);
//     res.render("group", { groups: groups });
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error.message });
//   }
// };
// /**
//  * @param { id }
//  * @description:this function is used to delete chat from db
//  */
// const CreateGroup = async (req, res) => {
//   try {
//     const { limit, groupName } = req.body;

//     await GroupStore.createGroup({
//       creator_id: req.session.user._id,
//       limit: limit,
//       name: groupName,
//       image: "/images/" + req.file.filename,
//     });

//     const groups = await GroupStore.getGroups(req.session.user._id);

//     res.status(201).render("group", {
//       success: true,
//       message: "Group Created successfully!",
//       groups: groups,
//     });
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error.message });
//   }
// };
module.exports = {
  registerLoad,
  register,
  loadLogin,
  login,
  dashboard,
  logout,
  saveChat,
  deleteChat,
  // loadGroup,
  // CreateGroup,
};
