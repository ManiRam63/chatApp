const isLogin = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (!user) {
      res.redirect("/ ");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
const isLogout = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user) {
      res.redirect("/dashboard");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  isLogin,
  isLogout,
};
