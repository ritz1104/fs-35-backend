const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/getMe", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "current loggedin user fetched",
    data: req.user,
  });
});

router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
