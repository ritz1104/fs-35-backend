const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  password: String,
  gender: String,
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
