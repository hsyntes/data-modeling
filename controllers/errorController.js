const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const ErrorProvider = require("../classes/ErrorProvider");

// ! 409: Duplicate Error
const uniqueError = (err) => {
  if (err.keyPattern.hasOwnProperty("username"))
    return new ErrorProvider(409, "fail", "That user already exists.");

  return new ErrorProvider(409, "fail", err.message);
};

// ! 401: Forbidden
const validationError = (err) => {
  const messages = err.message.split(",");

  const message = messages
    .map((message, index) => message.split(":").at(index === 0 ? 2 : 1))
    .join("")
    .trim();

  return new ErrorProvider(401, "fail", message);
};

// ! JSON Web Token Authorization Error
const jsonWebTokenError = () =>
  new ErrorProvider(401, "fail", "Authorization failed.");

// ! JSON Web Token Expired Error
const tokenExpiredError = () =>
  new ErrorProvider(401, "fail", "Authorization expired. Please log in again.");

module.exports = (err, req, res, next) => {
  // * Error messages for production
  if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) err = uniqueError(err);
    if (err.name === "ValidationError") err = validationError(err);
    if (err instanceof JsonWebTokenError) err = jsonWebTokenError();
    if (err instanceof TokenExpiredError) err = tokenExpiredError();
  }

  // * For development
  if (process.env.NODE_ENV === "development") console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  next();
};
