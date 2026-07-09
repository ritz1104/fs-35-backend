const express = require("express");
const getImageController = require("../controllers/post.controller");
const upload = require("../config/multer");

const router = express.Router();

router.post("/", upload.single("image"), getImageController);

module.exports = router;
