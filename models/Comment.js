const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "A post comment is required."],
      trim: true,
    },

    // * Parent referencing
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // * Parent referencing
    commentedPost: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
