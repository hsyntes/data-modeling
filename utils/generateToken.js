const jsonwebtoken = require("jsonwebtoken");

module.exports = async (res, statusCode, user, message) => {
  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jsonwebtoken", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: true,
    sameSite: "none",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      user,
    },
  });
};
