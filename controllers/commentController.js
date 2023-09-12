const ErrorProvider = require("../classes/ErrorProvider");
const Comment = require("../models/Comment");

exports.makeComment = async (req, res, next) => {
  try {
    if (!req.params.postId)
      return next(
        new ErrorProvider(403, "fail", "Please specify a post to make comment.")
      );

    const { postId } = req.params;

    const comment = await Comment.create({
      comment: req.body.comment,
      commentedBy: req.user._id,
      commentedPost: postId,
    });

    res.status(201).json({
      status: "success",
      message: "Commented!",
      data: {
        comment,
      },
    });
  } catch (e) {
    next(e);
  }
};
