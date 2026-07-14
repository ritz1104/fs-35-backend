import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    media_urls: [
      {
        type: String,
        required: true,
      },
    ],
    caption: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("posts", postSchema);
export default PostModel;
