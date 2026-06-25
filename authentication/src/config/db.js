const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0/auth-fs35");
    console.log("mongodb connected");
  } catch (error) {
    console.log("error in db", error);
  }
};

module.exports = connectDB;
