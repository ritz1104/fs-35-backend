const express = require("express");
const getImageController = require("../controllers/post.controller");
const upload = require("../config/multer");

const router = express.Router();

router.post("/", upload.array("images", 5), getImageController);

module.exports = router;
