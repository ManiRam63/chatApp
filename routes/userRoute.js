const express = require("express");
const userRoute = express();
const expressSession = require("express-session");
const path = require("path");
const multer = require("multer");
const { SESSION_SECRET } = process.env;
userRoute.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
const cookieParser = require("cookie-parser");
const userController = require("../controllers/userController");
const { isLogin, isLogout } = require("../middleware/auth");
const fs = require("fs");
userRoute.set("view engine", "ejs");
userRoute.set("views", "./views");
userRoute.use(express.static("public"));
userRoute.use(cookieParser());
//image storage defined

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(path.join(__dirname, "../public/images"));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

userRoute.get("/register", isLogout, userController.registerLoad);
userRoute.post("/register", upload.single("image"), userController.register);
userRoute.get("/", isLogout, userController.loadLogin);
userRoute.post("/", userController.login);
userRoute.get("/logout", isLogin, userController.logout);
userRoute.get("/dashboard", userController.dashboard);
userRoute.post("/save-chat", isLogin, userController.saveChat);
userRoute.delete("/delete-chat", isLogin, userController.deleteChat);
// groups routes
userRoute.get("/group", isLogin, userController.loadGroup);
userRoute.post(
  "/group",
  isLogin,
  upload.single("image"),
  userController.CreateGroup
);
// userRoute.get("*", function (req, res) {
//   res.redirect("/");
// });

module.exports = userRoute;
