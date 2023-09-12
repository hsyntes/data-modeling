const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title."],
    },

    text: {
      type: String,
      required: [true, "A post must have a text."],
    },

    // * Referencing
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
