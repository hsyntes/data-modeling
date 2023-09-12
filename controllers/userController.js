const ErrorProvider = require("../classes/ErrorProvider");
const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (!req.params.id)
      return next(new ErrorProvider(403, "fail", "Please type a user id."));

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
      return next(new ErrorProvider(404, "fail", "That user doesn't exist."));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.follow = async (req, res, next) => {};

exports.unfollow = async (req, res, next) => {};
