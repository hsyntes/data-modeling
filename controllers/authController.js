const User = require("../models/User");
const ErrorProvider = require("../classes/ErrorProvider");
const jsonwebtoken = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    generateToken(res, 201, user, "You've signed up successfully.");
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password)
      return next(
        new ErrorProvider(
          403,
          "fail",
          "Please type your @username and password."
        )
      );

    const { username } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user)
      return next(
        new ErrorProvider(
          404,
          "fail",
          "No found user. You are able to sign up with that user."
        )
      );

    if (!(await user.isPasswordCorrect(req.body.password, user.password)))
      return next(new ErrorProvider(401, "fail", "Password doesn't match."));

    generateToken(res, 200, user, `Welcome back ${user.username}`);
  } catch (e) {
    next(e);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split("Bearer").at(1).trim();

    if (!token)
      return next(new ErrorProvider(401, "fail", "Authorization failed."));

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return next(
        new ErrorProvider(
          404,
          "fail",
          "Authentication expired or failed. Please log in again."
        )
      );

    user.password = undefined;

    // * Grant access
    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};
