const express = require("express");
const registerController = require("../controller/user.controller");

const router = express.Router();

router.get("/create", registerController);

module.exports = router;
