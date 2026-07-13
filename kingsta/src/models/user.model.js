import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      minlength: 8,
    },
    mobile: {
      type: String,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    stories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stories",
      },
    ],
    bio: {
      type: String,
    },
    dob: {
      type: Date,
    },
    reels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reels",
      },
    ],
    profile_pic: {
      type: String,
    },
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
