const sendFile = require("../config/imagekit");

const getImageController = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    let files = req.files;

    let uploadedImg = await Promise.all(
      files.map(async (elem) => {
        return await sendFile(elem.buffer, elem.originalname);
      })
    );

    console.log(uploadedImg);

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
