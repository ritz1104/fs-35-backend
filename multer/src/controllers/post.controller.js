const sendFile = require("../config/imagekit");

const getImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    let file = req.file;

    let uploadedFile = await sendFile(file.buffer, file.originalname);
    console.log(uploadedFile);

    return res.status(200).json({
      success: true,
      message: "File uploaded",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went error",
    });
  }
};

module.exports = getImageController;
