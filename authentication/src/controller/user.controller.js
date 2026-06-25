const registerController = (req, res) => {
  res.status(200).json({
    message: "Tum register tak phoch gye",
    success: true,
  });
};

module.exports = registerController;
