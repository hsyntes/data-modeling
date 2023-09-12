const ErrorProvider = require("../classes/ErrorProvider");
const Post = require("../models/Post");
const mongoose = require("mongoose");

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      text: req.body.text,
      postedBy: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    if (!req.params.id)
      return next(
        new ErrorProvider(403, "fail", "Please type a post id to get it.")
      );

    const { id } = req.params;

    const post = await Post.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    if (!req.params.id)
      return next(new ErrorProvider(403, "fail", "Please specify a post."));

    const { id } = req.params;

    // * Starting the transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    await Post.findById(id).session(session);

    await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Liked!",
    });
  } catch (e) {
    next(e);
  }
};

exports.unlikePost = async (req, res, next) => {
  try {
    if (!req.params.id)
      return next(new ErrorProvider(403, "fail", "Please specify a post."));

    const { id } = req.params;

    await Post.findByIdAndUpdate(id, {
      $pull: { likes: req.user._id },
    });

    res.status(200).json({
      status: "success",
      message: "Unliked!",
    });
  } catch (e) {
    next(e);
  }
};
