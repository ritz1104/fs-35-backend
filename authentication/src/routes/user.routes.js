const express = require("express");
const registerController = require("../controller/user.controller");

const router = express.Router();

router.post("/register", registerController);

module.exports = router;
